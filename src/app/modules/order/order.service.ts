import { Order } from './order.model';
import { Product } from '../product/product.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { IProduct } from '../product/product.interface';
import { orderUtils } from './order.utils';
import { TUser } from '../user/user.interface';
import { IOrder } from './order.interface';

const createOrder = async (
  user: TUser,
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string,
) => {
  const toBeOrderedProducts = payload?.products;
  if (
    !toBeOrderedProducts ||
    !Array.isArray(toBeOrderedProducts) ||
    toBeOrderedProducts.length === 0
  ) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order not specified');
  }

  const productIds = toBeOrderedProducts?.map(item => new Types.ObjectId(item.product));

  // Fetch all products involved in the order
  const products = await Product.find({ _id: { $in: productIds } });

  // Map products by ID for easy access
  const productMap: Record<string, IProduct> = {};
  products.forEach(product => (productMap[product._id.toString()] = product));

  let totalPrice = 0;
  // Validate each order item and prepare products with quantities
  const orderedProducts = toBeOrderedProducts.map(({ product, quantity }) => {
    const productItem = productMap[product];
    if (!productItem) {
      throw new AppError(httpStatus.NOT_FOUND, `Product with Id: ${product} does not exist.`);
    }
    if (!productItem.inStock) {
      throw new AppError(httpStatus.BAD_REQUEST, `Product with Id: ${product} is out of stock`);
    }
    if (productItem.quantity < quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient product available. Requested: ${quantity}, Available: ${productItem.quantity}`,
      );
    }
    totalPrice += productItem.price * quantity;

    return {
      product: productItem._id,
      quantity,
    };
  });

  // Reduce quantity and update inStock
  const bulkOperations = toBeOrderedProducts.map(({ product, quantity }) => {
    const productItem = productMap[product];
    const newQuantity = productItem.quantity - quantity;

    return {
      updateOne: {
        filter: { _id: product },
        update: {
          $set: { inStock: newQuantity > 0 },
          $inc: { quantity: -quantity },
        },
      },
    };
  });

  // Execute bulk write to update products
  await Product.bulkWrite(bulkOperations);

  // Create the order
  let order = await Order.create({
    user: user._id,
    products: orderedProducts,
    totalPrice,
  });

  // Integrate payment info
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user.name,
    customer_email: user.email,
    customer_phone: '0123456789',
    customer_address: 'BD, Dhaka',
    customer_city: 'Dhaka',
    // customer_phone: user.phone,
    // customer_address: user.address,
    // customer_city: user.city,
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const getAllOrdersOfSingleUser = async (userId: string) => {
  const orders = await Order.find({ user: userId });
  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.find();
  return orders;
};

const getSingleOrder = async (userId: string, productId: string) => {
  const order = await Order.findOne({ user: userId, _id: productId });
  return order;
};

const updateOrderStatus = async (id: string, payload: Pick<IOrder, 'status'>) => {
  const order = await Order.findByIdAndUpdate(id, payload);
  return order;
};

const verifyPayment = async (order_id: string) => {
  const [verifiedPayment] = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment) {
    const bankStatus = verifiedPayment.bank_status;
    let status = 'Pending';
    if (bankStatus === 'Success') status = 'Paid';
    else if (bankStatus === 'Failed') status = 'Pending';
    else if (bankStatus === 'Cancel') status = 'Cancelled';
    else status = 'Pending';

    await Order.findOneAndUpdate(
      { 'transaction.id': order_id },
      {
        'transaction.bank_status': bankStatus,
        'transaction.sp_code': verifiedPayment.sp_code,
        'transaction.sp_message': verifiedPayment.sp_message,
        'transaction.transactionStatus': verifiedPayment.transaction_status,
        'transaction.method': verifiedPayment.method,
        'transaction.date_time': verifiedPayment.date_time,
        status,
      },
    );
  }

  return verifiedPayment;
};

const calculateRevenue = async () => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $addFields: {
        totalOrderPrice: { $multiply: ['$productDetails.price', '$quantity'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: '$totalOrderPrice',
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);
  return result[0]?.totalRevenue || 0;
};

export const OrderServices = {
  createOrder,
  getAllOrdersOfSingleUser,
  updateOrderStatus,
  getAllOrders,
  getSingleOrder,
  verifyPayment,
  calculateRevenue,
};

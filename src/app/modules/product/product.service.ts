import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';
import { TUser } from '../user/user.interface';

const createOne = async (product: IProduct) => {
  const result = await Product.create(product);

  return result;
};

const fetchAll = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const result = await productQuery.queryModel;
  const meta = await productQuery.countTotal();

  if (result.length < 1) {
    throw new AppError(httpStatus.NOT_FOUND, 'No product found');
  }

  return { meta, result };
};

const fetchOne = async (id: string) => {
  const result = await Product.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `No product found with id: ${id}`);
  }

  return result;
};

const updateOne = async (user: TUser, id: string, payload: Partial<IProduct>) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, `No product found with id: ${id}`);
  }

  // Only the loggedIn-user who created the product can update
  if (product.owner.toString() !== user._id?.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to update this product!');
  }

  if (Object.keys(payload).length) {
    for (const [key, value] of Object.entries(payload)) {
      if (key in product) {
        product.set(key, value);
      }
    }

    const result = await product.save();

    return result;
  }

  return product;
};

const deleteOne = async (id: string, user: TUser) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This product is not found or already deleted!');
  }

  // Only the loggedIn-user who created the product can delete
  if (product.owner.toString() !== user._id?.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to delete this product!');
  }

  return await Product.deleteOne({ _id: id });
};

export const ProductServices = {
  createOne,
  fetchAll,
  fetchOne,
  updateOne,
  deleteOne,
};

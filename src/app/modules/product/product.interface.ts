import { Types } from 'mongoose';

// Product interface
export interface IProduct {
  _id?: Types.ObjectId;
  owner: Types.ObjectId;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible';
  description: string;
  quantity: number;
  inStock: boolean;
  imageUrl: string;
}

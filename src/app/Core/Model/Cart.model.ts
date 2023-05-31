import { IProduct } from './Product.model';

export interface ICart {
  product: IProduct;
  quantity: number;
}

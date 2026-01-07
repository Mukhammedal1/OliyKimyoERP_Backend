import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Customer } from '../../customers/entities/customer.entity';
import { Product } from '../../products/entities/product.entity';

@Schema({ _id: false })
class Productt {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product_id: Product;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total_price: number;
}

@Schema({ timestamps: true, versionKey: false })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: Customer.name, required: false })
  customer?: Customer;

  @Prop({ type: Number, required: true })
  total_amount: number;

  @Prop({ type: Number, required: true })
  paid_amount: number;

  @Prop({ type: String, required: false })
  note?: string;

  @Prop({ type: Number, required: false })
  customer_phone?: number;

  @Prop({ type: Boolean, required: true })
  is_new_customer: boolean;

  @Prop({ type: [Productt], required: true })
  products: Productt[];
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

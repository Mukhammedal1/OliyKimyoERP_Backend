import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { Unit } from '../../units/entities/unit.entity';

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: Number, required: true })
  buy_price: number;

  @Prop({ type: Number, required: true })
  stock_amount: number;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Category;

  @Prop({ type: Types.ObjectId, ref: Unit.name, required: true })
  unit: Unit;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

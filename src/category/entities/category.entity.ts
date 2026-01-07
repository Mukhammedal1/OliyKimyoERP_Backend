import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from '../../products/entities/product.entity';

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({ type: String, required: true })
  name: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);

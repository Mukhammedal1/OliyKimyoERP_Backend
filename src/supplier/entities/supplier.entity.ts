import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Supplier {
  @Prop({ type: String, minLength: 3, required: true })
  name: string;

  @Prop({ type: String, required: true })
  phone_number: string;

  @Prop({ type: Number, required: false, default: 0 })
  debt_amount: number;

}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

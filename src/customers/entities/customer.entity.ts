import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Customer {
  @Prop({ type: String, maxLength: 20, minLength: 3, required: true })
  name: string;

  @Prop({ type: String, required: true })
  phone_number: string;

  @Prop({ type: Number, required: false, default: 0 })
  debt_amount: number;

  @Prop({ type: String, required: false })
  note: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

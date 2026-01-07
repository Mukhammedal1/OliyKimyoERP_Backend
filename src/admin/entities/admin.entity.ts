import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, versionKey: false })
export class Admin {
  @Prop({ type: String, maxLength: 20, minLength: 3, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  login: string;

  @Prop({ type: String, required: true })
  hashedPassword: string;

  @Prop({ type: String, required: false })
  hashedToken?: string;

  @Prop({ type: Boolean, required: true, default: false })
  is_creator: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

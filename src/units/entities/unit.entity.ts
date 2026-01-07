import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Unit {
  @Prop({ type: String, required: true })
  name: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);

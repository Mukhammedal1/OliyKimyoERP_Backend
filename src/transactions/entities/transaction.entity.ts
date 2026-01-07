import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Customer } from '../../customers/entities/customer.entity';
import { CategoryTypeEnum, IncomeExpenseTypeEnum } from '../../common/enums';
import { Sale } from '../../sale/entities/sale.entity';
import { Purchase } from '../../purchase/entities/purchase.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';

@Schema({ timestamps: true, versionKey: false })
export class Transaction {
  @Prop({ type: String, required: true })
  incomeExpenseType: IncomeExpenseTypeEnum;

  @Prop({ type: String, required: true })
  categoryType: CategoryTypeEnum;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: false })
  note?: string;

  @Prop({
    type: Types.ObjectId,
    ref: Sale.name,
    required: false,
  })
  saleId?: Sale;

  @Prop({
    type: Types.ObjectId,
    ref: Purchase.name,
    required: false,
  })
  purchaseId?: Purchase;

  @Prop({
    type: Types.ObjectId,
    ref: Customer.name,
    required: false,
  })
  customerId?: Customer;

  @Prop({
    type: Types.ObjectId,
    ref: Supplier.name,
    required: false,
  })
  supplierId?: Supplier;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './entities/purchase.entity';
import { Model, Types } from 'mongoose';
import { TransactionsService } from '../transactions/transactions.service';
import { SupplierService } from '../supplier/supplier.service';
import { CategoryTypeEnum, IncomeExpenseTypeEnum } from '../common/enums';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name)
    private readonly purchaseModel: Model<Purchase>,
    private readonly transactionService: TransactionsService,
    private readonly supplierService: SupplierService,
  ) {}
  async create(createPurchaseDto: CreatePurchaseDto) {
    const { supplier, total_amount, paid_amount } = createPurchaseDto;
    if (supplier && total_amount > paid_amount) {
      await this.supplierService.update(supplier, {
        debt_amount: total_amount - paid_amount,
      });
    }
    const purchase = await this.purchaseModel.create(createPurchaseDto);
    await this.transactionService.create({
      incomeExpenseType: IncomeExpenseTypeEnum.EXPENSE,
      categoryType: CategoryTypeEnum.PURCHASE,
      amount: total_amount,
      note: '',
      purchaseId: String(purchase._id),
    });
    return purchase;
  }

  async findAll() {
    return await this.purchaseModel
      .find()
      .populate('supplier')
      .populate('products.product_id');
  }

  async findOne(id: string) {
    const result = await this.purchaseModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .populate('supplier');
    if (!result) {
      throw new NotFoundException('Purchase topilmadi');
    }
    return result;
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Purchase topilmadi');
    }
    return await this.purchaseModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updatePurchaseDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Purchase topilmadi');
    }
    return await this.purchaseModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

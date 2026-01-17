import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from './entities/sale.entity';
import { Model, Types } from 'mongoose';
import { TransactionsService } from '../transactions/transactions.service';
import { CustomersService } from '../customers/customers.service';
import { CategoryTypeEnum, IncomeExpenseTypeEnum } from '../common/enums';
import { log } from 'node:console';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale.name)
    private readonly saleModel: Model<Sale>,
    private readonly transactionService: TransactionsService,
    private readonly customerService: CustomersService,
  ) {}
  async create(createSaleDto: CreateSaleDto) {
    const { customer, total_amount, paid_amount } = createSaleDto;
    if (customer && total_amount > paid_amount) {
      await this.customerService.update(customer, {
        debt_amount: total_amount - paid_amount,
      });
    }
    const sale = await this.saleModel.create(createSaleDto);
    await this.transactionService.create({
      incomeExpenseType: IncomeExpenseTypeEnum.INCOME,
      categoryType: CategoryTypeEnum.SALE,
      amount: total_amount,
      note: '',
      saleId: String(sale._id),
    });
    return sale;
  }

  async findAll() {
    return await this.saleModel
      .find()
      .populate('customer')
      .populate('products.product_id');
  }

  async findAllByCustomerId(id: string) {
    console.log(id);
    return await this.saleModel
      .find({ customer: id })
      .populate('customer')
      .populate('products.product_id');
  }

  async findOne(id: string) {
    const result = await this.saleModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .populate('customer');
    if (!result) {
      throw new NotFoundException('Sale topilmadi');
    }
    return result;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Sale topilmadi');
    }
    return await this.saleModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateSaleDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Sale topilmadi');
    }
    return await this.saleModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

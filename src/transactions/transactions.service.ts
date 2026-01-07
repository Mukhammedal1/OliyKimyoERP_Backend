import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './entities/transaction.entity';
import { Model, Types } from 'mongoose';
import { CustomersService } from '../customers/customers.service';
import { SupplierService } from '../supplier/supplier.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly customerService: CustomersService,
    private readonly supplierService: SupplierService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const { customerId, supplierId, amount, incomeExpenseType } =
      createTransactionDto;
    if (customerId && incomeExpenseType === 'KIRIM') {
      const customer = await this.customerService.findOne(customerId);
      if (!customer) {
        throw new NotFoundException('Mijoz topilmadi');
      }
      if (customer.debt_amount <= 0) {
        throw new BadRequestException('Ushbu mijozda qarz mavjud emas');
      }
      if (customer.debt_amount < amount) {
        throw new BadRequestException(
          `To'lov miqdori qarzdan katta bo'lishi mumkin emas. Qarz miqdori: ${customer.debt_amount}`,
        );
      }
      await this.customerService.update(customerId, {
        debt_amount: customer.debt_amount - amount,
      });
    }
    if (supplierId && incomeExpenseType === 'CHIQIM') {
      const supplier = await this.supplierService.findOne(supplierId);
      if (!supplier) {
        throw new NotFoundException("Ta'minotchi topilmadi");
      }
      if (supplier.debt_amount <= 0) {
        throw new BadRequestException(
          "Ushbu ta'minotchidan qarzimiz mavjud emas",
        );
      }
      if (supplier.debt_amount < amount) {
        throw new BadRequestException(
          `To'lov miqdori qarzdan katta bo'lishi mumkin emas. Qarz miqdori: ${supplier.debt_amount}`,
        );
      }
      await this.supplierService.update(supplierId, {
        debt_amount: supplier.debt_amount - amount,
      });
    }
    return await this.transactionModel.create(createTransactionDto);
  }

  async findAll() {
    return await this.transactionModel.find();
  }

  async findOne(id: string) {
    const result = await this.transactionModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new NotFoundException('Transaction topilmadi');
    }
    return result;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Transaction topilmadi');
    }
    return await this.transactionModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateTransactionDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Transaction topilmadi');
    }
    return await this.transactionModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

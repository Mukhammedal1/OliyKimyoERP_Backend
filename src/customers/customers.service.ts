import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,
  ) {}
  async create(createCustomerDto: CreateCustomerDto) {
    return await this.customerModel.create(createCustomerDto);
  }

  async findAll() {
    return await this.customerModel.find();
  }

  async findOne(id: string) {
    const result = await this.customerModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new NotFoundException('Customer topilmadi');
    }
    return result;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Customer topilmadi');
    }
    return await this.customerModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateCustomerDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Customer topilmadi');
    }
    return await this.customerModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

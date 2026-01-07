import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './entities/supplier.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private readonly supplierModel: Model<Supplier>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    return await this.supplierModel.create(createSupplierDto);
  }

  async findAll() {
    return await this.supplierModel.find();
  }

  async findOne(id: string) {
    const result = await this.supplierModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new NotFoundException('Supplier topilmadi');
    }
    return result;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Supplier topilmadi');
    }
    return await this.supplierModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateSupplierDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Supplier topilmadi');
    }
    return await this.supplierModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

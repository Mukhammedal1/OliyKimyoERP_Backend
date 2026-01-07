import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Unit } from './entities/unit.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name)
    private readonly unitModel: Model<Unit>,
  ) {}
  async create(createUnitDto: CreateUnitDto) {
    return await this.unitModel.create(createUnitDto);
  }

  async findAll() {
    return await this.unitModel.find();
  }

  async findOne(id: string) {
    const result = await this.unitModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new NotFoundException('Unit topilmadi');
    }
    return result;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Unit topilmadi');
    }
    return await this.unitModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateUnitDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Unit topilmadi');
    }
    return await this.unitModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    const result = await this.categoryModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new NotFoundException('Category topilmadi');
    }
    return result;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Category topilmadi');
    }
    return await this.categoryModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateCategoryDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Category topilmadi');
    }
    return await this.categoryModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create(createProductDto);
  }

  async findAll() {
    return await this.productModel.find().populate('category').populate('unit');
  }

  async findOne(id: string) {
    const result = await this.productModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .populate('category')
      .populate('unit');
    if (!result) {
      throw new NotFoundException('Product topilmadi');
    }
    return result;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Product topilmadi');
    }
    return await this.productModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateProductDto,
    );
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Product topilmadi');
    }
    return await this.productModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

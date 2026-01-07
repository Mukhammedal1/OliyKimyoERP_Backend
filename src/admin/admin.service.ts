import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './entities/admin.entity';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const { password, email, ...data } = createAdminDto;
    const admin = await this.adminModel.findOne({ email });
    if (admin) {
      throw new BadRequestException('Bunday admin mavjud');
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    return await this.adminModel.create({ hashedPassword, email, ...data });
  }

  async findAll() {
    return await this.adminModel.find();
  }

  async findOne(id: string) {
    const result = await this.adminModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!result) {
      throw new NotFoundException('Admin topilmadi');
    }
    return result;
  }

  async findOneByLogin(login: string) {
    const result = await this.adminModel.findOne({
      login,
    });
    // if (!result) {
    //   throw new NotFoundException('Admin topilmadi');
    // }
    return result;
  }

  async findOneByEmail(email: string) {
    const result = await this.adminModel.findOne({
      email,
    });
    // if (!result) {
    //   throw new NotFoundException('Admin topilmadi');
    // }
    return result;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Admin topilmadi');
    }
    return await this.adminModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateAdminDto,
    );
  }

  async clearRefreshToken(adminId: string): Promise<boolean> {
    const admin = await this.adminModel.findOneAndUpdate(
      { _id: adminId, hashedToken: { $ne: null } },
      { $set: { hashedToken: null } },
      { new: true },
    );

    if (!admin) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }

  async updateRefreshToken(id: string, hashed_refresh_token: string | null) {
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(id, {
      hashedToken: hashed_refresh_token,
    });
    return updatedAdmin;
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Admin topilmadi');
    }
    return await this.adminModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }
}

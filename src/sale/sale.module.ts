import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from './entities/sale.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    TransactionsModule, CustomersModule
  ],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { UnitsModule } from './units/units.module';
import { SaleModule } from './sale/sale.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseModule } from './purchase/purchase.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminModule } from './admin/admin.module';
import { AdminAuthModule } from './auth_admin/admin_auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL!),
    CustomersModule,
    CategoryModule,
    ProductsModule,
    UnitsModule,
    SaleModule,
    SupplierModule,
    PurchaseModule,
    TransactionsModule,
    AdminModule,
    AdminAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

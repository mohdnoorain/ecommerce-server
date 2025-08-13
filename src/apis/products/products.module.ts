import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Product, ProductSchema } from './entities/product.entity';
import { Category, CategorySchema } from './entities/category.entity';
import { ProductsService } from './products.service';
import { SeedService } from './seed.service';
import { ProductsController } from './products.controller';
import { ExceptionHandler } from 'src/utils/exceptionHandler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    })
  ],
  providers: [ProductsService, SeedService, ExceptionHandler],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule { }

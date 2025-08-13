import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    Param, 
    Post, 
    Put, 
    Query,
    UseGuards,
    BadRequestException
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ProductsService } from './products.service';
import { SeedService } from './seed.service';
import { 
    CreateProductDto, 
    UpdateProductDto, 
    ProductFilterDto 
} from './dtos/product.dto';
import { ExceptionHandler } from 'src/utils/exceptionHandler';
import { AuthGuard, Public } from 'src/guards';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly seedService: SeedService,
        private readonly exceptionHandler: ExceptionHandler,
    ) { }

    // Seed endpoint
    @Post('seed')
    @HttpCode(201)
    async seedDatabase() {
        try {
            return await this.seedService.seedDatabase();
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    @Get('seed/status')
    @HttpCode(200)
    @Public()
    async getSeedStatus() {
        try {
            return await this.seedService.getSeedStatus();
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    // Product endpoints
    @Post()
    @HttpCode(201)
    async createProduct(@Body() createProductDto: CreateProductDto) {
        try {
            return this.productsService.createProduct(createProductDto);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    @Get()
    @HttpCode(200)
    @Public()
    async getAllProducts(@Query() filterDto: ProductFilterDto) {
        try {
            return this.productsService.getAllProducts(filterDto);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    // Category endpoint - Only for fetching list
    @Get('categories')
    @HttpCode(200)
    @Public()
    async getAllCategories() {
        try {
            return this.productsService.getAllCategories();
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    @Get(':id')
    @HttpCode(200)
    @Public()
    async getProductById(@Param('id') id: string) {
        try {
            if (!isValidObjectId(id)) {
                throw new BadRequestException('Invalid product ID');
            }
            return this.productsService.getProductById(id);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    @Put(':id')
    @HttpCode(200)
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        try {
            return this.productsService.updateProduct(id, updateProductDto);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }

    @Delete(':id')
    @HttpCode(200)
    async deleteProduct(@Param('id') id: string) {
        try {
            return this.productsService.deleteProduct(id);
        } catch (error) {
            this.exceptionHandler.catchException(error);
        }
    }
}

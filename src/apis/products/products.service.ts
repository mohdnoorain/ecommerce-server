import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dtos/product.dto';
import { ResponseType } from 'src/interfaces/responseType';
import { PRODUCT_RES_MESSAGES } from 'src/constants/productResMessage.constant';

@Injectable()
export class ProductsService {

    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) { }

    // Product CRUD Operations
    async createProduct(createProductDto: CreateProductDto): Promise<ResponseType> {
        // Check if category exists
        const category = await this.categoryModel.findById(createProductDto.categoryId);
        if (!category) {
            throw new NotFoundException(PRODUCT_RES_MESSAGES.CATEGORY_NOT_FOUND);
        }

        const product = await this.productModel.create(createProductDto);

        // Update category count
        await this.categoryModel.findByIdAndUpdate(
            createProductDto.categoryId,
            { $inc: { count: 1 } }
        );

        return {
            message: PRODUCT_RES_MESSAGES.CREATED,
            data: {
                content: {
                    product: {
                        id: product._id,
                        name: product.name,
                        description: product.description,
                        imageURL: product.imageURL,
                        stockQty: product.stockQty,
                        tags: product.tags,
                        categoryId: product.categoryId,
                        price: product.price,
                        isActive: product.isActive
                    }
                }
            }
        };
    }

    async getAllProducts(filterDto: ProductFilterDto): Promise<ResponseType> {
        const { category, stockAvailability, search, page = '1', limit = '10' } = filterDto;

        // Convert string parameters to integers with validation
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;

        // Validate converted values
        if (pageNum < 1) throw new Error('Page must be greater than 0');
        if (limitNum < 1 || limitNum > 100) throw new Error('Limit must be between 1 and 100');

        let query: any = { isActive: true };

        // Category filter
        if (category) {
            query.categoryId = category;
        }

        // Stock availability filter
        if (stockAvailability === 'inStock') {
            query.stockQty = { $gt: 0 };
        } else if (stockAvailability === 'outOfStock') {
            query.stockQty = { $lte: 0 };
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            this.productModel.find(query)
                .populate('categoryId', 'name icon')
                .skip(skip)
                .limit(limitNum)
                .sort({ createdAt: -1 }),
            this.productModel.countDocuments(query)
        ]);

        const formattedProducts = products.map(product => ({
            id: product._id,
            name: product.name,
            description: product.description,
            imageURL: product.imageURL,
            stockQty: product.stockQty,
            tags: product.tags,
            categoryId: product.categoryId,
            price: product.price,
            isActive: product.isActive
        }));

        return {
            message: PRODUCT_RES_MESSAGES.LIST_RETRIEVED,
            data: {
                content: {
                    products: formattedProducts,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        pages: Math.ceil(total / limitNum)
                    }
                }
            }
        };
    }

    async getProductById(id: string): Promise<ResponseType> {
        const product = await this.productModel.findById(id)
            .populate('categoryId', 'name icon');

        if (!product) {
            throw new NotFoundException(PRODUCT_RES_MESSAGES.NOT_FOUND);
        }

        return {
            message: PRODUCT_RES_MESSAGES.RETRIEVED,
            data: {
                content: {
                    product: {
                        id: product._id,
                        name: product.name,
                        description: product.description,
                        imageURL: product.imageURL,
                        stockQty: product.stockQty,
                        tags: product.tags,
                        categoryId: product.categoryId,
                        price: product.price,
                        isActive: product.isActive
                    }
                }
            }
        };
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ResponseType> {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new NotFoundException(PRODUCT_RES_MESSAGES.NOT_FOUND);
        }

        // If category is being updated, check if new category exists
        if (updateProductDto.categoryId && updateProductDto.categoryId !== product.categoryId) {
            const newCategory = await this.categoryModel.findById(updateProductDto.categoryId);
            if (!newCategory) {
                throw new NotFoundException(PRODUCT_RES_MESSAGES.CATEGORY_NOT_FOUND);
            }

            // Update counts in category
            await Promise.all([
                this.categoryModel.findByIdAndUpdate(product.categoryId, { $inc: { count: -1 } }),
                this.categoryModel.findByIdAndUpdate(updateProductDto.categoryId, { $inc: { count: 1 } })
            ]);
        }

        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            updateProductDto,
            { new: true }
        ).populate('categoryId', 'name icon');

        return {
            message: PRODUCT_RES_MESSAGES.UPDATED,
            data: {
                content: {
                    product: {
                        id: updatedProduct._id,
                        name: updatedProduct.name,
                        description: updatedProduct.description,
                        imageURL: updatedProduct.imageURL,
                        stockQty: updatedProduct.stockQty,
                        tags: updatedProduct.tags,
                        categoryId: updatedProduct.categoryId,
                        price: updatedProduct.price,
                        isActive: updatedProduct.isActive
                    }
                }
            }
        };
    }

    async deleteProduct(id: string): Promise<ResponseType> {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new NotFoundException(PRODUCT_RES_MESSAGES.NOT_FOUND);
        }

        // Decrease category count
        await this.categoryModel.findByIdAndUpdate(
            product.categoryId,
            { $inc: { count: -1 } }
        );

        await this.productModel.findByIdAndDelete(id);

        return {
            message: PRODUCT_RES_MESSAGES.DELETED
        };
    }

    // Category Operations - Only for seeding and fetching
    async getAllCategories(): Promise<ResponseType> {
        const categories = await this.categoryModel.find({ isActive: true })
            .sort({ name: 1 });

        const formattedCategories = categories.map(category => ({
            id: category._id,
            name: category.name,
            icon: category.icon,
            count: category.count
        }));

        return {
            message: 'Categories retrieved successfully',
            data: {
                content: {
                    categories: formattedCategories
                }
            }
        };
    }
}

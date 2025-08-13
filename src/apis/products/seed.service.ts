import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { dummyProducts, categories, addCategoryIdsToProducts } from './data';

@Injectable()
export class SeedService {

    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) { }

    async seedDatabase(): Promise<any> {
        try {
            // Clear existing data
            await this.clearDatabase();

            // Seed categories first
            const createdCategories = await this.seedCategories();
            console.log(`✅ Created ${createdCategories.length} categories`);

            // Seed products with category IDs
            const productsWithCategories = addCategoryIdsToProducts(dummyProducts, createdCategories);
            const createdProducts = await this.seedProducts(productsWithCategories);
            console.log(`✅ Created ${createdProducts.length} products`);

            // Update category counts
            await this.updateCategoryCounts();

            return {
                message: 'Database seeded successfully',
                categories: createdCategories.length,
                products: createdProducts.length
            };
        } catch (error) {
            console.error('❌ Error seeding database:', error);
            throw error;
        }
    }

    private async clearDatabase(): Promise<void> {
        await Promise.all([
            this.productModel.deleteMany({}),
            this.categoryModel.deleteMany({})
        ]);
        console.log('🗑️ Cleared existing data');
    }

    private async seedCategories(): Promise<any[]> {
        const createdCategories = [];
        
        for (const category of categories) {
            const createdCategory = await this.categoryModel.create(category);
            createdCategories.push(createdCategory);
        }

        return createdCategories;
    }

    private async seedProducts(products: any[]): Promise<any[]> {
        const createdProducts = [];
        
        for (const product of products) {
            const createdProduct = await this.productModel.create(product);
            createdProducts.push(createdProduct);
        }

        return createdProducts;
    }

    private async updateCategoryCounts(): Promise<void> {
        const categories = await this.categoryModel.find();
        
        for (const category of categories) {
            const productCount = await this.productModel.countDocuments({ 
                categoryId: category._id 
            });
            
            await this.categoryModel.findByIdAndUpdate(category._id, { 
                count: productCount 
            });
        }
        
        console.log('📊 Updated category counts');
    }

    async getSeedStatus(): Promise<any> {
        const [productCount, categoryCount] = await Promise.all([
            this.productModel.countDocuments(),
            this.categoryModel.countDocuments()
        ]);

        return {
            products: productCount,
            categories: categoryCount,
            isSeeded: productCount > 0 && categoryCount > 0
        };
    }
}

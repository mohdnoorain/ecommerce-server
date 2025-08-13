import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, IsBoolean, IsUrl, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    description: string;

    @IsNotEmpty()
    @IsUrl()
    imageURL: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stockQty: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsUrl()
    imageURL?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stockQty?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ProductFilterDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    stockAvailability?: 'all' | 'inStock' | 'outOfStock';

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;
}

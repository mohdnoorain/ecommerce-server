import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: String, required: true, maxlength: 100 })
  name: string;

  @Prop({ type: String, required: true, maxlength: 500 })
  description: string;

  @Prop({ type: String, required: true })
  imageURL: string;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  stockQty: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String, required: true })
  categoryId: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

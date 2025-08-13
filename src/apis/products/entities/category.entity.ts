import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ type: String, required: true, maxlength: 50, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  icon: string;

  @Prop({ type: Number, default: 0, min: 0 })
  count: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

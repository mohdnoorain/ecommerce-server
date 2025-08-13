import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, maxlength: 50 })
  firstName: string;

  @Prop({ type: String, maxlength: 50 })
  lastName: string;

  @Prop({ type: String, maxlength: 50, unique: true, sparse: true }) // nullable + unique
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
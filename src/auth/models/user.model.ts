import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Document } from 'mongoose';
import { RoleTypes } from 'src/role.decorator';

@Schema()
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    required: true,
    index: {
      unique: true,
    },
    lowercase: true,
  })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({
    type: [{ type: String, enum: RoleTypes }],
    default: [RoleTypes.User],
  })
  roles: RoleTypes[];

  @Prop({ type: String, default: 'UTC' })
  timezone: string;

  @Prop({
    type: Number,
    default: moment().unix(),
  })
  createdAtTimestamp: number;

  @Prop({
    type: Number,
    default: moment().unix(),
  })
  updatedAtTimestamp: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

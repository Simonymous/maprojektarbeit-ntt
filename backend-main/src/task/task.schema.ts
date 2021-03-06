import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  constructor(
    title: string,
    description: string,
    content: string,
    creator: string,
    type: string,
    tags: [],
    course: string,
    pluginCode: string,
    dataForPlugin: any,
    closedTests: [],
    openTests: [],
  ) {}

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  content: string;

  @Prop()
  creator: string;

  @Prop()
  type: string;

  @Prop()
  tags: [];

  @Prop()
  course: string;

  @Prop()
  pluginCode: string;

  @Prop()
  dataForPlugin:any;

  @Prop()
  closedTests: [];

  @Prop()
  openTests: [];

  @Prop()
  date: Date;

}

export const TaskSchema = SchemaFactory.createForClass(Task);
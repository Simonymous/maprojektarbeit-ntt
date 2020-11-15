import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstquestionsModule } from './firstquestions/firstquestions.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [FirstquestionsModule, MongooseModule.forRoot('mongodb://root:example@mongo:27017/test?authSource=admin')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UserDTO } from './user.dto';
import { User,UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {

  }

  async create(userDto: UserDTO): Promise<User> {
    userDto.roles = [Role.Admin];
    const createdUser = new this.userModel(userDto);
    return createdUser.save()
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({'username': username});
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

}
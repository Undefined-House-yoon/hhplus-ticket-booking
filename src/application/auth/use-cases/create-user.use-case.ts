import { Injectable } from '@nestjs/common';
import { UserService } from '../../../domain/user/services/user.service';
import { User } from '../../../domain/user/entites/user';
import { CreateUserDto } from '../../../api/user/dto/create-user.dto';
import { ResponseUserDto } from '../../../api/user/dto/response-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  async execute(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const { userId, amount } = createUserDto;
    const user = await this.userService.createUser(User.create({ id: userId ,balance: amount }));
    return new ResponseUserDto({ id: userId, balance: user.balance });
  }
}

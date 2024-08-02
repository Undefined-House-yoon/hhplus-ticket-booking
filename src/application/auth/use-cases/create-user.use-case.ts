import { Injectable } from '@nestjs/common';
import { UserService } from '../../../domain/user/services/user.service';
import { User } from '../../../domain/user/entites/user';
import { CreateUserDto } from '../../../api/user/dto/create-user.dto';
import { BalanceService } from '../../../domain/balance/services/balance.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
  ) {
  }

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const { userId, amount } = createUserDto;
    const user: User = await this.userService.createUser(User.create({ id: userId }));
    await this.balanceService.chargeBalance(userId, amount);
    return user;
  }
}

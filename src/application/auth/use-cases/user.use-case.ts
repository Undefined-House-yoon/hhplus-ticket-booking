import { Injectable } from '@nestjs/common';
import { UserService } from '../../../domain/balance/services/user.service';
import { User } from '../../../domain/balance/entities/user';
import { CreateUserDto } from '../../../api/Identity/dto/create-user.dto';
import { BalanceService } from '../../../domain/balance/services/balance.service';

@Injectable()
export class UserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
  ) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { userId, amount } = createUserDto;
    const user: User = await this.userService.createUser(User.create({ id: userId }));
    await this.balanceService.chargeBalance(userId, amount);
    return user;
  }
}

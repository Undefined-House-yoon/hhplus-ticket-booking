import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../domain/auth/services/auth.service';
import { Token } from '../../../domain/auth/entities/token';
import { UserService } from '../../../domain/user/services/user.service';
import { CreateTokenDto } from '../../../api/Identity/dto/create-token.dto';

@Injectable()
export class GetTokenUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {
  }
  //todo:구현해야함.
  async execute(creteTokenDto:CreateTokenDto) : Promise<Token> {
    let user = await this.userService.findById(creteTokenDto.userId)
    if (user) {
      return await this.authService.createToken(creteTokenDto);
    }
    throw Error('User not found');
  }
}

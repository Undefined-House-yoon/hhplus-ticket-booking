import { Injectable } from '@nestjs/common';
import { TokenService } from '../../../domain/auth/services/token.service';
import { Token } from '../../../domain/auth/entities/token';
import { UserService } from '../../../domain/user/services/user.service';
import { CreateTokenDto } from '../../../api/auth/dto/create-token.dto';

@Injectable()
export class GetTokenUseCase {
  constructor(
    private readonly authService: TokenService,
    private readonly userService: UserService,
  ) {
  }

  async execute(creteTokenDto: CreateTokenDto): Promise<Token> {
    let user = await this.userService.findById(creteTokenDto.userId);
    return await this.authService.createToken(creteTokenDto);
  }
}

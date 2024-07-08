import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../../domain/auth/services/auth.service';
import { Token } from '../../../domain/auth/entities/token';
import { CreateTokenDto } from '../../../api/auth/dto/create-token.dto';

@Injectable()
export class GetTokenUseCase {
  constructor(private readonly authService: AuthService) {
  }
  //todo:구현해야함.
  async execute(creteTokenDto:CreateTokenDto) : Promise<Token> {
    let token = await this.authService.createToken(creteTokenDto);
    // let token = new Token(new UserId(creteTokenDto.userId));
    console.log(token);
    return token;
  }
}

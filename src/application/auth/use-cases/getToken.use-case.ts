import { Injectable } from '@nestjs/common';
import { TokenService } from '../../../domain/auth/services/token.service';

@Injectable()
export class GetTokenUseCase {
  constructor(
    private readonly authService: TokenService,
  ) {}

  async execute(userId:number): Promise<string> {
    return this.authService.createToken(userId);
  }
}

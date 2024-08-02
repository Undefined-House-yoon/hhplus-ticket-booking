import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key', // JWT 시크릿 키 설정
      signOptions: { expiresIn: '60m' }, // 토큰 만료 시간 설정
    }),
  ],
  providers:[JwtStrategy,ConfigService],
  exports:[PassportModule,JwtModule],
})
export class AuthConfigModule{}

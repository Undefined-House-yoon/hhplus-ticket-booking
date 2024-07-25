import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // JWT 시크릿 키 설정
      signOptions: { expiresIn: '60m' }, // 토큰 만료 시간 설정
    }),],
  exports:[PassportModule,JwtModule],
})
export class AuthConfigModule{}

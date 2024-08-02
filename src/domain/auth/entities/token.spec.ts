import { Token } from './token';
import * as jwt from 'jsonwebtoken';

describe('Token', () => {
  test('[should] 사용자 ID로 토큰을 생성해야 합니다', () => {
    const userId = 1;
    const entryTime = new Date();
    const user
      = { userId: userId, entryTime: entryTime };

    const token = Token.create(user);

    expect(token.userId).toEqual(userId);
    expect(token.token).toBeDefined();
    expect(token.token.length).toBeGreaterThan(0);
  });

  test('[should] 인스턴스마다 다른 토큰 값을 생성해야 합니다.', () => {
    const userId = 1;
    const token1 = Token.create({ userId: 1,});
    const token2 = Token.create({ userId: 2,});
    expect(token1.token).not.toEqual(token2.token);
  });


  test('[should] 생성된 토큰을 검증할 수 있어야 합니다.', () => {
    const userId = 1;
    const tokenInstance = Token.create({ userId });
    const verifiedUser = Token.verifyToken(tokenInstance.token);

    expect(verifiedUser.userId).toEqual(userId.toString());
  });

  test('[should] 유효하지 않은 토큰을 검증하면 에러를 발생시켜야 합니다.', () => {
    const invalidToken = 'invalid.token.value';
    expect(() => {
      Token.verifyToken(invalidToken);
    }).toThrow('Invalid token');
  });

  test('[should] 토큰의 만료 시간이 설정되어야 합니다.', () => {
    const userId = 1;
    const tokenInstance = Token.create({ userId });
    const decodedToken = jwt.decode(tokenInstance.token) as { exp: number };

    // 토큰의 만료 시간이 현재 시간보다 커야 합니다.//jwt.exp == 초단위 date.now == millisecond 그래서 1000으로 나눠야함
    expect(decodedToken.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('[should] entryTime이 주어지지 않으면 현재 시간이 설정되어야 합니다.', () => {
    const userId = 1;
    const tokenInstance = Token.create({ userId });
    const currentTime = new Date();

    // entryTime이 현재 시간과 거의 같아야 합니다 (약간의 오차 허용).
    expect(tokenInstance.entryTime.getTime()).toBeCloseTo(currentTime.getTime(), -2);
  });

  test('[should] expiredAt이 entryTime 이후의 시간으로 설정되어야 합니다.', () => {
    const userId = 1;
    const tokenInstance = Token.create({ userId });
    expect(tokenInstance.expiredAt.getTime()).toBeGreaterThan(tokenInstance.entryTime.getTime());
  });
});

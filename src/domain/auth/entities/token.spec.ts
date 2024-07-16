
import { Token } from './token';

describe('Token', () => {
  test('[should] 사용자 ID로 토큰을 생성해야 합니다', () => {
    const userId = 1;
    const token = new Token(userId);

    expect(token.getUserId()).toEqual(userId);
    expect(token.getValue()).toBeDefined();
    expect(token.getValue().length).toBeGreaterThan(0);
  });

  test('[should] 인스턴스마다 다른 토큰 값을 생성해야 합니다.', () => {
    const userId = 1;
    const token1 = new Token(userId);
    const token2 = new Token(userId);

    expect(token1.getValue()).not.toEqual(token2.getValue());
  });
});

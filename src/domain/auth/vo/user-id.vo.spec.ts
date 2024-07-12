// src/domain/auth/value-objects/user-id.vo.spec.ts

import { UserId } from './user-id.vo';

describe('UserId', () => {
  test('[should] String 으로 UserId를 생성해야 합니다.', () => {
    const id = 'user123';
    const userId = new UserId(id);
    expect(userId.value).toBe(id);
  });

  test('[should] 빈 문자열로 생성되면 오류가 발생해야 합니다.', () => {
    expect(() => new UserId('')).toThrow('User ID cannot be empty');
  });

  test('[should] 50자를 초과하는 문자열로 생성되면 오류가 발생해야 합니다.', () => {
    const longId = 'a'.repeat(51);
    expect(() => new UserId(longId)).toThrow('User ID cannot be longer than 50 characters');
  });

  test('[should] be comparable', () => {
    const id1 = new UserId('user123');
    const id2 = new UserId('user123');
    const id3 = new UserId('user456');

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});

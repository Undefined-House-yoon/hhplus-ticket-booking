import { UserId } from '../vo/user-id.vo';

/**
 * 토큰 테스트
 * */
export class Token {
  private readonly value: string;
  private readonly entryTime: number;
  private readonly expiredAt: number;


  constructor(private readonly userId: UserId) {
    this.value = this.generateTokenValue();
    this.entryTime = Date.now();
    this.expiredAt = Date.now() + 5 * 60 * 1000; // 5분 더함
  }

  getUserId(): UserId {
    return this.userId;
  }

  getValue(): string {
    return this.value;
  }

 // 이값을 조합해서 jwt나 혹은 추후 바뀔 대기열대비 토큰
  private generateTokenValue(): string {
    return `value:${this.getUserId().value},entryTime:${this.entryTime},expiredAt:${this.expiredAt}`;
  }
}

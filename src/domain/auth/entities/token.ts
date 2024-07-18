/**
 * 토큰 테스트
 * */
export class Token {
   value: string;
   entryTime: number;
   expiredAt: number;


  constructor(private readonly userId: number) {
    this.entryTime = Date.now();
    this.expiredAt = Date.now() + 5 * 60 * 1000; // 5분 더함
    this.value = this.generateTokenValue();
  }

  getUserId(): number {
    return this.userId;
  }

  getValue(): string {
    return this.value;
  }

  static create({ userId, entryTime, expiredAt, value }: {
    userId: number,
    entryTime: number,
    expiredAt: number,
    value: string
  }): Token {
    let token = new Token(userId);
    token.value = value;
    token.entryTime = entryTime;
    token.expiredAt = expiredAt;
    return token;
  }

  // 이값을 조합해서 jwt나 혹은 추후 바뀔 대기열대비 토큰
  private generateTokenValue(): string {
    return `value:${this.getUserId()},entryTime:${this.entryTime},expiredAt:${this.expiredAt}`;
  }
}

// 와 점점 자바스럽네 ㅠㅠ js 맞나 이거 ㅠㅠ
// export class Token {
//
//
//
//   private constructor(
//     private readonly _userId: number,
//     private _token: string,
//     private readonly _entryTime:number,
//     private readonly _expiredAt:number,
//     private readonly _id?: number,
//
//   ) {
//   }
//
//   get entryTime(): number {
//     return this._entryTime;
//   }
//
//   get expiredAt(): number {
//     return this._expiredAt;
//   }
//
//   get userId(): number {
//     return this._userId;
//   }
//
//   get token(): string {
//     return this._token;
//   }
//
//   set token(value: string) {
//     this._token = this.generateTokenValue();
//   }
//
//   get id(): number {
//     return this._id;
//   }
//
//   static create({ userId, token, entryTime, expiredAt, id }:
//                   {
//                     userId: number, token: string, entryTime: number, expiredAt: number, id?: number
//                   }): Token {
//     return new Token(userId, token, entryTime, expiredAt, id);
//   }
//
//     private generateTokenValue(): string {
//     return `value:${this.userId},entryTime:${this.entryTime},expiredAt:${this.expiredAt}`;
//   }
//
// }

export class Token {
  readonly userId: number;
  readonly expiredAt: Date;
  readonly createdAt: Date;


  static create(params: {
                  userId: number,
                  createdAt?: Date,
                  expiredAt?: Date,
                },
  ): Token {
    return new Token(params);
  }

  private constructor(
    {
      userId,
      createdAt,
      expiredAt,
    }: {
      userId: number;
      createdAt?: Date;
      expiredAt?: Date;
    },
  ) {
    this.userId = userId;
    this.createdAt = createdAt??new Date();
    this.expiredAt = expiredAt??new Date(this.createdAt.getTime() + 5 * 60 * 1000) ?? null;
  }
}

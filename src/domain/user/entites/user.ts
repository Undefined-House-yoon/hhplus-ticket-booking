export class User {
  readonly id: number;
  private _balance: number;

  // 잔액 조회
  get balance(): number {
    return this._balance;
  }

  // 잔액 충전
  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this._balance += amount;
  }

  // 잔액 사용
  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    if (this._balance < amount) {
      throw new Error('Insufficient balance');
    }
    this._balance -= amount;
  }

  private constructor(
    { id, balance }: {
      id: number,
      balance: number,
    },
  ) {
    this.id = id;
    this._balance = balance;
  }


  static create({ id, balance = 0 }: { id: number; balance?: number }): User {
    if (!id) {
      throw new Error('ID is required');
    }
    return new User({ id:id, balance:balance });
  }
}


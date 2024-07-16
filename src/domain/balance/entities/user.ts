export class User {
  private constructor(
    public id: number,
    public balance: number,
  ) {
  }

  static create({ id, balance = 0 }: { id: number; balance?: number }): User {
    if (!id) {
      throw new Error('ID is required');
    }
    return new User(id, balance);
  }
}

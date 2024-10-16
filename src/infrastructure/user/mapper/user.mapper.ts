import { User } from '../../../domain/user/entites/user';


export class UserMapper {
  static toDomain(prismaUser: any): User {
    return User.create({
      id: prismaUser.id,
      balance: prismaUser.balance
    });
  }

  static fromDomain(user: User): any {
    return {
      id: user.id,
      balance: user.balance
    };
  }
}

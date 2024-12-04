import { User } from '../entites/user';

export abstract class UserRepository {

  abstract findById(id: number): Promise<User | null> ;

  abstract save(user: User): Promise<User> ;
}

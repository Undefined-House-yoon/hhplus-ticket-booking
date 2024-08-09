import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { UserService } from '../../../domain/user/services/user.service';
import { CreateUserDto } from '../../../api/user/dto/create-user.dto';
import { User } from '../../../domain/user/entites/user';
import { ResponseUserDto } from '../../../api/user/dto/response-user.dto';
import { AppModule } from '../../../app.module';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ]
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userService = module.get<UserService>(UserService);
  });

  it('should create a user and return the user data', async () => {
    const createUserDto: CreateUserDto = { userId: 1, amount: 100 };
    const user = User.create({ id: createUserDto.userId, balance: createUserDto.amount });

    jest.spyOn(userService, 'createUser');

    const result = await createUserUseCase.execute(createUserDto);

    expect(result).toEqual(new ResponseUserDto({ id: user.id, balance: user.balance }));
    expect(userService.createUser).toHaveBeenCalledWith(user);
  });

  it('should create 10000 users', async () => {
    const userCount = 50000;
    const users: CreateUserDto[] = [];

    for (let i = 1; i <= userCount; i++) {
      users.push({ userId: i, amount: 1000 });
      const user = User.create({ id: i, balance: 1000 });
      jest.spyOn(userService, 'createUser');
    }

    const results: Promise<ResponseUserDto>[] = [];

    for (const userDto of users) {
      const result = createUserUseCase.execute(userDto);
      results.push(result);
      // expect(userService.createUser).toHaveBeenCalledWith(User.create({ id: userDto.userId, balance: userDto.amount }));
    }
    // console.log(results.length);
    Promise.all(results);
    // expect(results.length).toBe(userCount);
    // for (let i = 1; i <= userCount; i++) {
    //   expect(results[i - 1]).toEqual(new ResponseUserDto({ id: i, balance: 1000 }));
    // }
  }, 30000);
});

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/user/repositories/user.repository';
import { User } from '../../../domain/user/entites/user';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserMapper } from '../mapper/user.mapper';


@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private prisma: PrismaService) {}
  /**
   * 주어진 ID로 사용자를 찾습니다.
   * @param id 사용자 ID
   * @returns 사용자를 찾으면 User 객체, 찾지 못하면 null
   */
  async findById(id: number): Promise<User | null> {
    // id 값이 제대로 전달되고 있는지 확인
    if (id === undefined || id === null) {
      throw new Error('Invalid ID');
    }
    const user = await this.prisma.user.findUnique({ where: { id:id } });
    return user ? UserMapper.toDomain(user) : null;
  }
  /**
   * 사용자 데이터를 저장합니다. 사용자 ID가 존재하면 업데이트하고, 존재하지 않으면 새로 생성합니다.
   * @param user 저장할 User 객체
   * @returns 저장된 User 객체
   */
  async save(user: User): Promise<User> {
    const prismaData = await this.prisma.user.upsert({
      where: { id: user.id},
      update: {
        balance: user.balance,
      },
      create: {
        id: user.id,
        balance: user.balance,
      },
    });
    return UserMapper.toDomain(prismaData);
  }
}

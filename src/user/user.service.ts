import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../drizzle/schemas';
import { sql } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await hash(createUserDto.password, 10);
      const data = await this.db
        .insert(sc.users)
        .values({
          email: createUserDto.email,
          password: createUserDto.password,
          name: createUserDto.name,
          lastName: createUserDto.lastName,
        })
        .execute();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
      throw new Error('Failed to create user');
    }
  }

  async findAll() {
    const data = await this.db
      .select()
      .from(sc.users)
      .execute()
      .then((res) => res[0]);
    console.log(data);

    return `This action returns all user`;
  }

  async findByEmail(email: string) {
    return await this.db
      .select({
        id: sc.users.id,
        email: sc.users.email,
        password: sc.users.password,
      })
      .from(sc.users)
      .where(sql`${sc.users.email} = ${email}`)
      .execute()
      .then((res) => res[0]);
  }

  async getProfile(email: string) {
    return await this.db
      .select({
        name: sc.users.name,
        email: sc.users.email,
        lastName: sc.users.lastName,
      })
      .from(sc.users)
      .where(sql`${sc.users.email} = ${email}`)
      .execute()
      .then((res) => res[0]);
  }

  async comparePassword(password: string, hash: string) {
    return await compare(password, hash);
  }
}

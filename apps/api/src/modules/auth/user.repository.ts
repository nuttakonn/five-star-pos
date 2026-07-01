import { BaseSheetsRepository } from '../../shared/repositories/base-sheets.repository';
import { SHEETS } from '../../shared/constants/sheets.constants';

export interface UserEntity {
  username: string;
  password_hash: string;
  role: 'admin' | 'viewer';
  active: string;
}

export class UserRepository extends BaseSheetsRepository<UserEntity> {
  protected sheetName = SHEETS.USERS;
  protected columns: (keyof UserEntity)[] = ['username', 'password_hash', 'role', 'active'];

  async findByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.getAll();
    return users.find(u => u.username === username) || null;
  }

  async updatePassword(username: string, newHash: string): Promise<void> {
    await this.update('username', username, { password_hash: newHash });
  }

  async create(user: UserEntity): Promise<void> {
    await this.append(user);
  }
}

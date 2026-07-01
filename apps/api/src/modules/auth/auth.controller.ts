import { Request, Response } from 'express';
import { UserRepository } from './user.repository';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../shared/errors/api.error';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  constructor(private userRepo: UserRepository) {}

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await this.userRepo.findByUsername(username);

    if (!user || user.active !== 'TRUE') {
      throw ApiError.badRequest('Invalid username or account inactive');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw ApiError.badRequest('Invalid password');
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      data: {
        token,
        username: user.username,
        role: user.role
      }
    });
  };

  changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const username = (req as any).user.username;

    const user = await this.userRepo.findByUsername(username);
    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) throw ApiError.badRequest('Current password incorrect');

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await this.userRepo.updatePassword(username, newHash);

    res.json({ success: true, message: 'Password updated successfully' });
  };

  getAllUsers = async (req: Request, res: Response) => {
    const users = await this.userRepo.getAll();
    const safeUsers = users.map(({ password_hash, ...u }) => u);
    res.json({ success: true, data: safeUsers });
  };

  createUser = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    
    const existing = await this.userRepo.findByUsername(username);
    if (existing) throw ApiError.badRequest('Username already exists');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await this.userRepo.create({
      username,
      password_hash,
      role,
      active: 'TRUE'
    });

    res.status(StatusCodes.CREATED).json({ success: true, message: 'User created successfully' });
  };

  updateUserStatus = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { active } = req.body;
    
    await this.userRepo.update('username', username, { 
      active: active ? 'TRUE' : 'FALSE' 
    });

    res.json({ success: true, message: 'User status updated' });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { username } = req.params;
    
    // Prevent self-deletion
    if ((req as any).user.username === username) {
      throw ApiError.badRequest('Cannot delete your own account');
    }

    await this.userRepo.delete(username);
    res.json({ success: true, message: 'User deleted successfully' });
  };

  resetUserPassword = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { newPassword } = req.body;

    const user = await this.userRepo.findByUsername(username);
    if (!user) throw ApiError.notFound('User not found');

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await this.userRepo.updatePassword(username, newHash);

    res.json({ success: true, message: `Password for ${username} reset successfully` });
  };
}

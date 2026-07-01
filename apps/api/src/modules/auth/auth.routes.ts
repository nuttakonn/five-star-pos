import { Router } from 'express';
import { AuthController } from './auth.controller';
import { UserRepository } from './user.repository';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { adminOnly } from '../../shared/middlewares/admin-only.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();
const userRepo = new UserRepository();
const authController = new AuthController(userRepo);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' }
});

router.post('/login', loginLimiter, authController.login);
router.post('/change-password', authMiddleware, authController.changePassword);

// User Management (Admin only)
router.get('/users', authMiddleware, adminOnly, authController.getAllUsers);
router.post('/users', authMiddleware, adminOnly, authController.createUser);
router.patch('/users/:username', authMiddleware, adminOnly, authController.updateUserStatus);
router.patch('/users/:username/reset-password', authMiddleware, adminOnly, authController.resetUserPassword);
router.delete('/users/:username', authMiddleware, adminOnly, authController.deleteUser);

export const authRoutes = router;

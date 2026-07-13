import { Router } from 'express';
import authRoutes from './auth.routes';
import musicRoutes from './music.routes';
import playlistRoutes from './playlist.routes';

const router = Router();

// 注册路由
router.use('/auth', authRoutes);
router.use('/music', musicRoutes);
router.use('/playlist', playlistRoutes);

export default router;
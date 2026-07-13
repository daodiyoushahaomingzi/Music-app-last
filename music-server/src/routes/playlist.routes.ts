import { Router } from 'express';
import playlistController from '../controllers/PlaylistController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// 需要认证的路由
router.post('/create', authMiddleware, playlistController.createPlaylist.bind(playlistController));
router.get('/my', authMiddleware, playlistController.getUserPlaylists.bind(playlistController));
router.post('/add-song', authMiddleware, playlistController.addSongToPlaylist.bind(playlistController));
router.delete('/:id', authMiddleware, playlistController.deletePlaylist.bind(playlistController));

// 公开路由
router.get('/:id', playlistController.getPlaylistDetail.bind(playlistController));

export default router;
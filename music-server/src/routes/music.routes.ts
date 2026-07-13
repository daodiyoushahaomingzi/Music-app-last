import { Router } from 'express';
import musicController from '../controllers/MusicController';

const router = Router();

router.get('/playlists', musicController.getRecommendPlaylists.bind(musicController));
router.get('/songs', musicController.getRecommendSongs.bind(musicController));
router.get('/search', musicController.search.bind(musicController));
router.get('/url', musicController.getSongUrl.bind(musicController));
router.get('/detail', musicController.getSongDetail.bind(musicController));
router.get('/lyric', musicController.getLyric.bind(musicController));

export default router;
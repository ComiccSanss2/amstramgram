import { Router } from 'express';
import { PostController } from '../controllers/PostController.js';

const router: Router = Router();

router.post('/', PostController.create);
router.get('/:id', PostController.getOne);
router.get('/', PostController.getAll);
router.post('/like/:id', PostController.likePost);
router.post('/unlike/:id', PostController.unlikePost);
router.post('/comment/:id', PostController.createComment);
router.post('/comment/like/:id', PostController.likeComment);
router.post('/comment/unlike/:id', PostController.unlikeComment);

export default router;
import { Router } from 'express';
import { PostController } from '../controllers/PostController.js';

const router = Router();

router.post('/', PostController.create);  
router.get('/:id', PostController.getOne); 
router.get('/', PostController.getAll);    

export default router;
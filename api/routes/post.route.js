import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletePosts, getPosts, updatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletePosts);
router.put('/updatepost/:postId/:userId', verifyToken, updatePost);


export default router;

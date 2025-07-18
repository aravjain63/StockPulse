import { Router } from 'express';
import { signUp, signIn, getProfile } from '../controllers/authcontroller';
import { authenticateToken } from '../middleware/auth';
import { validate, signUpSchema, signInSchema } from '../middleware/validation';

const router = Router();

// POST /api/auth/signup
router.post('/signup', validate(signUpSchema), signUp);

// POST /api/auth/signin
router.post('/signin', validate(signInSchema), signIn);

// GET /api/auth/profile
router.get('/profile', authenticateToken, getProfile);

export default router;
import { Router } from 'express';
import { createAdmin, loginAdmin } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';

const router = Router();

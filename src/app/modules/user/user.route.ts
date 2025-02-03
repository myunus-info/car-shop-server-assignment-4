import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';

const router = Router();

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUsers);

router.get('/me', auth(USER_ROLE.admin, USER_ROLE.user), UserControllers.getMe);

router
  .route('/:userId')
  .get(auth(USER_ROLE.admin), UserControllers.getSingleUser)
  .put(auth(USER_ROLE.admin), UserControllers.updateUserStatus);

export const UserRoutes = router;

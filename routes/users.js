const router = require('express').Router();
const { validateUserById, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validators');



const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUser
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
router.get('/:id', validateUserById, getUserById);
module.exports = router;

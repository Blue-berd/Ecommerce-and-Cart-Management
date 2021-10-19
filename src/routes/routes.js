const express = require('express');
const router = express.Router();

const {userAuth, userAuthorisation} = require('../middlewares');
const {userController} = require('../controllers');
const {jwt} = require('../utils');

router.post('/users', userController.createUser)


router.post('/login', userController.loginUser)

router.get('/user/:userId/profile',userAuth,userAuthorisation, userController.getUser)

router.put('/user/:userId/profile',userAuth,userAuthorisation, userController.updateUser)


module.exports = router;
const express = require('express')
const router = express.Router()
const {getAllUsers, getsingleUser, updateUser, updateUserPassword, deleteUser, updateUserEmail, verifyOTP, showCurrentUser} = require('../controllers/userController')
const {authenticateUser, authorizePermission} = require('../middlewares/authenticate')

router.get('/getAllUsers',authenticateUser, authorizePermission('admin'), getAllUsers)
router.get('/showCurrentUser',authenticateUser,showCurrentUser)
router.patch('/updateUser',authenticateUser,updateUser)
router.patch('/updateUserPassword',authenticateUser,updateUserPassword)
router.patch('/updateUserEmail',authenticateUser,updateUserEmail)
router.post('/verifyOTP',authenticateUser,verifyOTP)
router.delete('/deleteUser',authenticateUser,deleteUser)

router.get('/id',authenticateUser,getsingleUser)

module.exports = router
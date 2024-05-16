const router = require("express").Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/loginAdmin', userCtrl.loginAdmin)
router.put('/updatePassword', userCtrl.updatePassword);
router.put('/updateUser', auth, userCtrl.UpdateUser)
router.put('/updateAdmin', auth, authAdmin, userCtrl.UpdateAdmin)
router.get('/user', auth, userCtrl.getUserById);
router.delete('/deleteuser/:id', auth, authAdmin, userCtrl.deleteUser);
router.get('/getAllUsers', auth, authAdmin, userCtrl.getAll);
router.post('/forgotpassword', userCtrl.forgotPassword);
module.exports = router
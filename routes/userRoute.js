const router = require("express").Router()
const userCtrl = require('../controllers/userCtrl')

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/loginAdmin', userCtrl.loginAdmin)
router.post('/logout', userCtrl.logout)

router.put('/updateUser/:id', userCtrl.UpdateUser)
router.delete('/deleteuser/:id', userCtrl.deleteUser);
router.get('/getAllUsers', userCtrl.getAll);



module.exports = router
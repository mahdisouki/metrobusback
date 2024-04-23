const router = require("express").Router()
const userCtrl = require('../controllers/userCtrl')

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.put('/updateUser/:id', userCtrl.UpdateUser)

//router.post('/logout', userCtrl.logout)
router.get('/getAllUsers', userCtrl.getAll);



module.exports = router
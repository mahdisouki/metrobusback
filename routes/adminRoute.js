const router = require("express").Router()
const adminCtrl = require("../controllers/adminCtrl")

router.post('/register', adminCtrl.register)
router.post('/login', adminCtrl.login)
router.put('/updateUser/:id', adminCtrl.UpdateUser)

router.post('/logout', adminCtrl.logout)
router.get('/getAllUsers', adminCtrl.getAll);



module.exports = router
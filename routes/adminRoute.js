const router = require("express").Router()
const userCtrl = require ('../controllers/adminCtrl')

router.post('/register',userCtrl.register)
router.post('/login',userCtrl.login)
router.put('/updateUser/:id' ,  userCtrl.UpdateUser)




module.exports = router
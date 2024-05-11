const router = require("express").Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/loginAdmin', userCtrl.loginAdmin)

router.put('/updateUser', auth, userCtrl.UpdateUser)
router.put('/updateAdmin', auth, authAdmin, userCtrl.UpdateAdmin)
router.get('/user', auth, userCtrl.getUserById);
router.delete('/deleteuser/:id', auth, authAdmin, userCtrl.deleteUser);
router.get('/getAllUsers', auth, authAdmin, userCtrl.getAll);
router.get('/getStatsCards', auth, authAdmin, userCtrl.getStatCards)
router.get('/userDataByMonth', auth, authAdmin, userCtrl.getUserDataByMonth);
router.get('/getUserSatisfaction', auth, authAdmin, userCtrl.getUserSatisfaction);
router.get('/getRatingCount', auth, authAdmin, userCtrl.getRatingCount);
router.get('/getTicketByDay', auth, authAdmin, userCtrl.getTicketsByDayInWeek)
router.get('/getTopTrajetByBus/:id', auth, authAdmin, userCtrl.getTopReservedTrajets)
router.get('/getTopTrajetByMetro/:id', auth, authAdmin, userCtrl.getTopReservedTrajets)

module.exports = router
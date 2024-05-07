const router = require("express").Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/loginAdmin', userCtrl.loginAdmin)

router.put('/updateUser', auth, userCtrl.UpdateUser)
router.put('/updateAdmin', auth, authAdmin, userCtrl.UpdateAdmin)

router.delete('/deleteuser/:id', auth, authAdmin, userCtrl.deleteUser);
router.get('/getAllUsers', auth, authAdmin, userCtrl.getAll);
router.get('/getStatsCards', userCtrl.getStatCards)
router.get('/userDataByMonth', userCtrl.getUserDataByMonth);
router.get('/getUserSatisfaction', userCtrl.getUserSatisfaction);
router.get('/getRatingCount', userCtrl.getRatingCount);
router.get('/getTicketByDay', userCtrl.getTicketsByDayInWeek)
router.get('/getTopTrajetByBus/:id', userCtrl.getTopReservedTrajets)
router.get('/getTopTrajetByMetro/:id', userCtrl.getTopReservedTrajets)

module.exports = router
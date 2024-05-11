const router = require("express").Router()
const dashboardCtrl = require('../controllers/dashboardCtrl')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
router.get('/getStatsCards', auth, authAdmin, dashboardCtrl.getStatCards)
router.get('/userDataByMonth', auth, authAdmin, dashboardCtrl.getUserDataByMonth);
router.get('/getUserSatisfaction', auth, authAdmin, dashboardCtrl.getUserSatisfaction);
router.get('/getRatingCount', auth, authAdmin, dashboardCtrl.getRatingCount);
router.get('/getTicketByDay', auth, authAdmin, dashboardCtrl.getTicketsByDayInWeek)
router.get('/getTopTrajetByBus/:id', auth, authAdmin, dashboardCtrl.getTopReservedTrajets)
router.get('/getTopTrajetByMetro/:id', auth, authAdmin, dashboardCtrl.getTopReservedTrajets)

module.exports = router
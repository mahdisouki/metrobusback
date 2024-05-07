const router = require("express").Router()
const dashboardCtrl = require('../controllers/dashboardCtrl')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
router.get('/getStatsCards', dashboardCtrl.getStatCards);
router.get('/userDataByMonth', dashboardCtrl.getUserDataByMonth);
router.get('/getUserSatisfaction', dashboardCtrl.getUserSatisfaction);
router.get('/getRatingCount', dashboardCtrl.getRatingCount);
router.get('/getTicketByDay', dashboardCtrl.getTicketsByDayInWeek);
router.get('/getTopTrajetByBus/:id', dashboardCtrl.getTopReservedTrajets);
router.get('/getTopTrajetByMetro/:id', dashboardCtrl.getTopReservedTrajets);

module.exports = router
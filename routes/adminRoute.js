const router = require('express').Router();
const {AdminClass} = require('../controllers/adminController')
const {authMiddleware} = require('../middlewares/authMiddleware')


router.get('/allUsers',authMiddleware,AdminClass.getAllUsers);
router.get('/allDoctors',authMiddleware,AdminClass.getAllDoctors);
router.post('/approve-doctor',authMiddleware,AdminClass.approveDoctor)




module.exports = router;
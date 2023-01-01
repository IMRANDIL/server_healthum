const router = require("express").Router();
const { AuthClass } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/signup", AuthClass.signupController);
router.post("/login", AuthClass.loginController);
router.post("/getUserInfo", authMiddleware, AuthClass.getUserInfoController);
router.post(
  "/apply-doctor-account",
  authMiddleware,
  AuthClass.applyDoctorController
);

router.post(
  "/mark-all-notifications-seen",
  authMiddleware,
  AuthClass.notificationController
);
router.post(
  "/delete-all-seen-notifications",
  authMiddleware,
  AuthClass.deleteAllNotificationController
);
router.get(
  "/get-all-approved-doctors",
  authMiddleware,
  AuthClass.getAllApprovedDoctors
);
router.get(
  "/get-appointments-by-userId",
  authMiddleware,
  AuthClass.getAppointmentsInfo
);
module.exports = router;

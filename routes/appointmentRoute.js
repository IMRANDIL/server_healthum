const router = require("express").Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { appointmentClass } = require("../controllers/appointmentController");

router.post(
  "/book-appointment",
  authMiddleware,
  appointmentClass.setAppointment
);

router.post(
  "/check-availability",
  authMiddleware,
  appointmentClass.checkAvailability
);

module.exports = router;

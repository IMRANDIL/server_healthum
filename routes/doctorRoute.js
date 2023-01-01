const router = require("express").Router();
const { doctorClass } = require("../controllers/doctorController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post(
  "/get-doctor-info-by-userId",
  authMiddleware,
  doctorClass.getDoctorByuserId
);
router.post(
  "/get-doctor-info-by-doctorId",
  authMiddleware,
  doctorClass.getDoctorByDoctorId
);
router.put("/update-doctor-profile", authMiddleware, doctorClass.updateDoctor);
router.get(
  "/get-appointments-by-doctorId",
  authMiddleware,
  doctorClass.getAppointmentsInfo
);
router.post(
  "/approve-appointments",
  authMiddleware,
  doctorClass.approveAppointments
);

module.exports = router;

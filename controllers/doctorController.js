const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

class DoctorContr {
  getDoctorByuserId = async (req, res, next) => {
    try {
      const user = await Doctor.findOne({ userId: req.body.userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          msg: "User does not exist!",
        });
      }

      res.status(200).json({
        success: true,
        msg: "user doctor fetched",
        user,
      });
    } catch (error) {
      res.status(500).send({ msg: "Something went wrong!", success: false });
    }
  };

  updateDoctor = async (req, res, next) => {
    try {
      const user = await Doctor.findOne({ userId: req.body.userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          msg: "User does not exist!",
        });
      }

      await Doctor.findByIdAndUpdate(user._id, req.body);
      res.status(201).json({
        success: true,
        msg: "Profile Updated!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong!", success: false });
    }
  };

  getDoctorByDoctorId = async (req, res, next) => {
    try {
      const doctor = await Doctor.findOne({ _id: req.body.doctorId });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          msg: "Doctor does not exist!",
        });
      }
      res.status(200).json({
        success: true,
        msg: "doctor details fetched",
        doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong!", success: false });
    }
  };

  getAppointmentsInfo = async (req, res, next) => {
    try {
      const findDoctorId = await Doctor.findOne({ userId: req.user._id });
      if (!findDoctorId) {
        return res.status(404).json({
          success: false,
          msg: "Doctor does not exist!",
        });
      }

      const appointmentInfo = await Appointment.find({
        doctorId: findDoctorId._id,
      });

      res.status(200).json({
        success: true,
        data: appointmentInfo,
        msg: "appointments info fetched",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong!", success: false });
    }
  };

  approveAppointments = async (req, res, next) => {
    const { appointmentId, userId, status } = req.body;
    try {
      const findUser = await User.findById(userId);
      if (!findUser) {
        return res.status(404).json({
          success: false,
          msg: "User does not exist!",
        });
      }

      const appointment = await Appointment.findOne({ _id: appointmentId });
      if (!appointment) {
        return res.status(404).json({
          success: false,
          msg: "appointment does not exist!",
        });
      }

      if (status === "pending" || status === "rejected") {
        appointment.status = "approved";
      } else {
        appointment.status = "rejected";
      }

      await appointment.save();
      const unseenNotifications = findUser.unseenNotifications;
      unseenNotifications.push({
        type: "appointment-request",
        msg: `${appointment.userInfo.name}, your appointment is ${appointment.status} now.`,
        data: {
          doctorId: appointment.doctorInfo._id,
          name: `${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName}`,
          mobileNumber: appointment.doctorInfo.mobileNumber,
        },
        onClickPath: "/appointments",
      });

      await User.findByIdAndUpdate(userId, {
        unseenNotifications: unseenNotifications,
      });
      res.status(200).json({
        success: true,
        msg: `${appointment.userInfo.name}'s appointment ${appointment.status}!`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong!", success: false });
    }
  };
}

const doctorClass = new DoctorContr();
module.exports = { doctorClass };

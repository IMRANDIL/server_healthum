const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

class Auth {
  loginController = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ msg: "All Fields required!", success: false });
    }
    try {
      const user = await User.findOne({ email: req.body.email.toLowerCase() });
      if (!user) {
        return res
          .status(404)
          .send({ msg: "User does not exist!", success: false });
      }
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordMatch) {
        return res
          .status(400)
          .send({ msg: "Invalid Credentials!", success: false });
      }
      const jwtToken = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        email: user.email,
        success: true,
        msg: "Login Successful!",
        token: jwtToken,
      });
    } catch (error) {
      res.status(500).send({ msg: "Something went wrong!", success: false });
    }
  };

  signupController = async (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ msg: `All Fields are required!`, success: false });
    }

    try {
      const user = await User.findOne({ email: req.body.email.toLowerCase() });
      if (user) {
        return res
          .status(400)
          .json({ msg: `User Already Exists!`, success: false });
      }
      const hashPassword = await bcrypt.hash(req.body.password, 12);
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      });
      res.status(201).json({ msg: "Signup successful!", success: true });
    } catch (error) {
      res.status(500).json({ msg: "Something went Wrong", success: false });
    }
  };

  getUserInfoController = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          msg: "User Not Found!",
          success: false,
        });
      }
      res.status(200).json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
          isDoctor: user.isDoctor,
          createdAt: user.createdAt,
          unseenNotifications: user.unseenNotifications,
          seenNotifications: user.seenNotifications,
        },
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something Went wrong",
        success: false,
      });
    }
  };

  applyDoctorController = async (req, res, next) => {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.mobileNumber ||
      !req.body.address ||
      !req.body.experience ||
      !req.body.specialization
    ) {
      return res
        .status(400)
        .json({ msg: `All Fields are required!`, success: false });
    }

    try {
      const isValidUser = await User.findOne({ _id: req.body.userId });
      if (!isValidUser) {
        return res.status(400).json({
          success: false,
          msg: "Bad Request",
        });
      }

      const isDoctorExist = await Doctor.findOne({ userId: req.body.userId });
      if (isDoctorExist) {
        return res.status(400).json({
          success: false,
          msg: "You have already applied!",
        });
      }

      const newDoctor = await Doctor.create(req.body);
      const adminUser = await User.findOne({ isAdmin: true });
      const unseenNotifications = adminUser.unseenNotifications;

      unseenNotifications.push({
        type: "new-doctor-request",
        msg: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account.`,
        data: {
          doctorId: newDoctor._id,
          name: `${newDoctor.firstName} ${newDoctor.lastName}`,
          email: isValidUser.email,
        },
        onClickPath: "/admin/doctors",
      });
      await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
      res.status(200).json({
        success: true,
        msg: "Doctor account request sent successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went Wrong", success: false });
    }
  };

  notificationController = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      if (!user) {
        return res.status(404).json({
          msg: "User not found",
          success: false,
        });
      }

      const seenNotifications = user.seenNotifications;
      const unseenNotifications = user.unseenNotifications;
      user.seenNotifications = [...seenNotifications, ...unseenNotifications];
      user.unseenNotifications = [];

      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).json({
        success: true,
        msg: "All notifications marked as seen",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went Wrong", success: false });
    }
  };

  deleteAllNotificationController = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      if (!user) {
        return res.status(404).json({
          msg: "User not found",
          success: false,
        });
      }
      user.seenNotifications = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).json({
        success: true,
        msg: "All notifications deleted",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went Wrong", success: false });
    }
  };

  getAllApprovedDoctors = async (req, res, next) => {
    try {
      const approvedDoctors = await Doctor.find({ status: "approved" });
      res.status(200).json({
        success: true,
        approvedDoctors,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went Wrong", success: false });
    }
  };

  getAppointmentsInfo = async (req, res, next) => {
    try {
      const appointmentsInfo = await Appointment.find({
        userId: req.user._id,
      });
      res.status(200).json({
        success: true,
        data: appointmentsInfo,
        msg: "Appointments info fetched",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went Wrong", success: false });
    }
  };
}

const AuthClass = new Auth();
module.exports = { AuthClass };

const User = require('../models/userModel');
const Doctor = require('../models/doctorModel')


class Admin {
    getAllUsers = async(req,res,next)=>{
try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page-1)*limit;
    const totalUsers = await User.countDocuments();

    const pages = Math.ceil(totalUsers/limit);
    const users = await User.find({}).select('-password').skip(skip).limit(limit)
    res.status(200).json({
        success:true,
        msg:'Users Fetched',
        pages: pages,
        users
    })
} catch (error) {
    res.status(500).send({ msg: "Something went wrong!", success: false }); 
}
    }


    getAllDoctors = async(req,res,next)=>{
        try {


            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page-1)*limit;
            const totalUsers = await Doctor.countDocuments();
        
            const pages = Math.ceil(totalUsers/limit);


            const doctors = await Doctor.find({}).select('-password').skip(skip).limit(limit);
            res.status(200).json({
                success:true,
                msg:'Doctors Fetched',
                pages:pages,
                doctors
            })
        } catch (error) {
            res.status(500).send({ msg: "Something went wrong!", success: false }); 
        }
    }

    approveDoctor = async(req,res,next)=>{
        const {doctorId,userId,status} = req.body;
        try {
            const findUser = await User.findById(userId);
            if(!findUser){
                return res.status(404).json({
                    success:false,
                    msg:'User does not exist!'
                })
            }

            const findDoctor = await Doctor.findById(doctorId);
            if(!findDoctor){
                return res.status(404).json({
                    success:false,
                    msg:'Doctor does not exist!'
                })
            }

            if(status === 'pending' || status === 'blocked'){
                findDoctor.status = 'approved'
            }else{
                findDoctor.status = 'blocked'
            }
    
         await findDoctor.save();
            const unseenNotifications = findUser.unseenNotifications;
            unseenNotifications.push({
                type: "approval-request",
                msg: `${findDoctor.firstName} ${findDoctor.lastName}, your account is ${findDoctor.status} now.`,
                data: {
                  doctorId: findDoctor._id,
                  name: `${findDoctor.firstName} ${findDoctor.lastName}`,
                  email: findUser.email
                },
                onClickPath: "",
              });

              await User.findByIdAndUpdate(userId,{unseenNotifications:unseenNotifications,isDoctor:true});
              res.status(200).json({
                success:true,
                msg:`${findDoctor.firstName}'s account ${findDoctor.status}!`
              })
        } catch (error) {
            res.status(500).send({ msg: "Something went wrong!", success: false });
        }
    }
}

const AdminClass = new Admin();
module.exports = {AdminClass};
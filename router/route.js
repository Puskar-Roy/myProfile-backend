const Router = require('express');
const { register, login , getUser , updateUser , genarateOtp , verifyOtp , resetSession , resetPassword} = require('../controller/appController')
// const { registerMail} = require('../controller/mailer')
const mailerController = require("../controller/mailer");
const { verifyUser , authMiddlewear , localVar } = require("../middlewears/middlewear");




const router = Router();

router.post("/register",register);
router.post("/registerMail",mailerController.registerMail);
router.post("/authenticate",verifyUser, (req, res) => {res.end()});
router.post("/login",verifyUser, login);

router.get("/user/:username", getUser);
router.get("/generateOtp", verifyUser, localVar , genarateOtp);
router.get("/verifyOtp", verifyOtp);
router.get("/recovary", resetSession);

router.put("/updateProfile", authMiddlewear ,updateUser);
router.put("/resetPassword", resetPassword);







module.exports = router
// export default router
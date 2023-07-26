const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpgenaretor = require("otp-generator");

// {"userName":"Puskar",
// "email":"email",
// "password":"password"}
const register = async (req, res) => {
  try {
    const { userName, email, password, profile, phone } = req.body;
    const userExist = await User.findOne({ email: email });
    const userExistName = await User.findOne({ userName: userName });
    if (userExistName) {
      return res.status(500).json({ error: "Please Use Different Username" });
    } else if (userExist) {
      return res.status(500).json({ error: "Please Use Different Email" });
    } else {
      const user = new User({
        userName,
        email,
        password,
        profile: profile || "",
        phone: phone,
      });
      const userRegister = await user.save();
      if (userRegister) {
        res.status(201).json({ msg: "Sign Up Done !" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// { "userName": "Puskar", "password": "password" }
const login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const userExistName = await User.findOne({ userName: userName });
    if (!userExistName) {
      return res.status(404).json({ error: "Username Not Found" });
    } else {
      const verifyPass = await bcrypt.compare(password, userExistName.password);
      if (verifyPass) {
        const token = await jwt.sign(
          { userId: userExistName._id, userName: userExistName.userName },
          process.env.SEC,
          { expiresIn: "24h" }
        );
        if (token) {
          res.status(201).json({
            msg: "Log In Done !",
            userName: userExistName.userName,
            token: token,
          });
        }
      } else {
        return res.status(500).json({ error: "Invalid Details " });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    if (!username) {
      return res.status(501).json({ error: "Invalid Username" });
    } else {
      const userExistName = await User.findOne({ userName: username });
      if (userExistName) {
        const { password, ...rest } = Object.assign({}, userExistName.toJSON());
        return res.status(201).send(rest);
      } else {
        return res.status(404).send({ error: "Can't Find User Data" });
      }
    }
  } catch (error) {
    return res.status(404).send({ error: "Can't Find User Data" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      const update = await User.updateOne({ _id: userId }, body);
      console.log(" hochhe na");
      if (update) {
        return res.status(201).send({ msg: "Record Updated" });
      } else {
        return res.status(404).send({ error: "Update Error" });
      }
    } else {
      return res.status(404).send({ error: "Can't Find Data" });
    }
  } catch (error) {
    return res.status(404).send({ error: "Can't Update Data...." });
  }
};


// const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     if (!userId) {
//       return res
//         .status(404)
//         .send({ error: "User ID not found in the request" });
//     }

//     const body = req.body;
//     const update = await User.updateOne({ _id: userId }, body);

//     if (update.nModified > 0) {
//       return res.status(200).send({ msg: "Record Updated successfully" });
//     } else {
//       return res.status(404).send({ error: "User record not found" });
//     }
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return res.status(500).send({ error: "Internal Server Error" });
//   }
// };

const genarateOtp = async (req, res) => {
  req.app.locals.otp = await otpgenaretor.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.send({ code: req.app.locals.otp });
};

const verifyOtp = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.otp) == parseInt(code)) {
    req.app.locals.otp = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "Verify Successfull" });
  } else {
    return res.status(401).send({ err: "Invalid OTP" });
  }
};

const resetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Ji Le Apni Zindegil" });
  } else {
    return res.status(401).send({ err: "Session Expired" });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    } else {
      const { userName, password } = req.body;
      const userExist = await User.findOne({ userName });

      if (userExist) {
        const passhash = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
        if (passhash) {
          const updatemodel = await User.updateOne(
            { userName: userExist.userName }, // Use userExist.userName instead of user.username
            { password: passhash }
          );
          if(updatemodel){
            req.app.locals.resetSession = false;
            return res.status(201).send({ msg: "Record Updated...!" });
          }else{
            return res.status(500).send({ error: "Unable to update password" });
          }
        } else {
          return res.status(500).send({ error: "Unable to hash password" });
        }
      } else {
        return res.status(404).send({ error: "Username not Found" });
      }
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};



module.exports = {
  register: register,
  login: login,
  getUser: getUser,
  updateUser: updateUser,
  genarateOtp: genarateOtp,
  verifyOtp: verifyOtp,
  resetSession: resetSession,
  resetPassword:resetPassword
};

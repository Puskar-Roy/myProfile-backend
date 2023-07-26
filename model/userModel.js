const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");




const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  address: {
    type: String,
  },
  profile: {
    type: String,
  },
  work: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
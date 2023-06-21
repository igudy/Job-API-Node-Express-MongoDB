const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")

// Password hashing
// const bcrypt = require("bcryptjs")

const register = async (req, res) => {
  // res.send("register user")
  //   if (!name || !email || !password) {
  //     throw new BadRequestError("Please provide name, email and password")
  //   }

  //   const { name, email, password } = req.body
  //   const salt = await bcrypt.genSalt(10)
  //   const hashedPassword = await bcrypt.hash(password, salt)
  //   const tempUser = { name, email, password: hashedPassword }

  // You can add this part to the controller or through
  // mongooseDB, code has been refactored to work from the
  // controller

  //   const token = jwt.sign({ userId: user._id, name: user.name }, "jwtSecret", {
  //     expiresIn: "30d",
  //   })

  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }
  const user = await User.findOne({ email })
  // compare password
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}

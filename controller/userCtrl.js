const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDB_Id = require("../utils/validateMongoDB_Id");
const { generateRefreshToken } = require("../config/refreshToken");

//To create a new user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // Existing User
    throw new Error("User Already Exists");
  }
});

//To Signin user
const signInUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );

    // set refreshToken in Cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Check UserId and Password!");
  }
});

//Handle Refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  //find refresh Token in cookies
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("There is no Refresh Token in cookies");
  };
  const refreshToken = cookie.refreshToken;

  //find user with the help of refresh token in Database
  const user = await User.findOne({refreshToken});
  if (!user) throw new Error ("Cannot match Refresh Token from Database");
  // Verify refresh Token in cookies and also from Database 
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Something wrong with Refresh Token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
} )

//To get all Users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//To get a single User
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDB_Id(id);
  try {
    const getAUser = await User.findById(id);
    res.json({ getAUser });
  } catch (error) {
    throw new Error(error);
  }
});

//To update a User
const updateSingleUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDB_Id(_id);
  try {
    const updateAUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json({ updateAUser });
  } catch (error) {
    throw new Error(error);
  }
});

//To delete a  User
const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDB_Id(id);
  try {
    const deleteAUser = await User.findByIdAndDelete(id);
    res.json({ deleteAUser });
  } catch (error) {
    throw new Error(error);
  }
});

//To block a User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDB_Id(id);
  try {
    const blockAUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockAUser);
  } catch (error) {
    throw new Error(error);
  }
});

//To unblock a User
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDB_Id(id);
  try {
    const unblockAUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblockAUser);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUser,
  signInUserCtrl,
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
};

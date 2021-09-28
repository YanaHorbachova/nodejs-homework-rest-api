const Users = require("../model/users");
const HttpCode = require("../helpers/constants");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUD,
  api_secret: process.env.API_SECRET_CLOUD,
});

const uploadToCloud = promisify(cloudinary.uploader.upload);

const signup = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      contentType: "application/json",
      code: HttpCode.CONFLICT,
      responseBody: {
        message: "Email in use",
      },
    });
  }
  try {
    const newUser = await Users.create(req.body);
    return res.json({
      status: "created",
      contentType: "application/json",
      code: HttpCode.CREATED,
      responseBody: {
        user: {
          email: newUser.email,
          avatar: newUser.avatar,
          subscription: newUser.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = await user?.validPassword(password);
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      responseBody: {
        message: "Email or password is wrong",
      },
    });
  }
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
  await Users.updateToken(user.id, token);
  return res.status(HttpCode.OK).json({
    status: "Ok",
    contentType: "application/json",
    code: HttpCode.OK,
    responseBody: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const current = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.getCurrentUser(userId);
    console.log(user);
    if (user) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } else {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const { idCloudAvatar, avatarUrl } = await saveAvatarUserToCloud(req);

  const user = await Users.updateAvatar(id, avatarUrl, idCloudAvatar);
  if (user) {
    return res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, user: { avatarUrl } });
  } else {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  }
};

const saveAvatarUser = async (req) => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`;
  const image = await jimp.read(pathFile);
  await image
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  try {
    await fs.rename(
      pathFile,
      path.join(process.cwd(), "public", FOLDER_AVATARS, newNameAvatar)
    );
  } catch (error) {
    console.log(error.message);
  }
  const oldAvatar = req.user.avatar;
  if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
    await fs.unlink(path.join(process.cwd(), "public", oldAvatar));
  }
  return path.join(FOLDER_AVATARS, newNameAvatar).replace("\\", "/");
};


const saveAvatarUserToCloud = async (req) => {
  const pathFile = req.file.path;
  const { public_id: idCloudAvatar, secure_url: avatarUrl } =
    await uploadToCloud(pathFile, {
      public_id: req.user.idCloudAvatar?.replace("Avatars/", ""),
      folder: "Avatars",
      transformation: { width: 250, height: 250, crop: "pad" },
    });
  await fs.unlink(pathFile);
  return { idCloudAvatar, avatarUrl };
};

module.exports = {
  signup,
  login,
  logout,
  current,
  updateAvatar,
  saveAvatarUser,
};
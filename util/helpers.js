const { CustomError } = require("../util/errors");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const DatauriParser = require("datauri/parser");
const crypto = require("crypto");

const createJWT = ({ email, name }, duration = "2h") => {
  if (!(email || name)) {
    throw new CustomError("Could not authenticate");
  }
  return jwt.sign({ email, name }, process.env.TOKEN_SECRET, {
    expiresIn: duration,
  });
};

const uploadFile = async (file) => {
  const parser = new DatauriParser();
  const ext = `.${file.mimetype.split("/")[1]}`;
  const fileStr = parser.format(ext, file.buffer);
  const upload = await cloudinary.uploader.upload(fileStr.content, {
    folder: "portal",
  });
  return { url: upload.secure_url, public_id: upload.public_id };
};

const genStr = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};

const addMinutes = (dt, minutes) => {
  return new Date(dt.getTime() + minutes * 60000);
};

module.exports = { createJWT, uploadFile, genStr, addMinutes };

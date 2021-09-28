const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const guard = require("../../helpers/guard");
const {
  validationCreateUser,
  validationLoginUser,
} = require("./validation.js");
const uploadAvatar = require("../../helpers/upload-avatar");

router.get("/current", guard, ctrl.current);
router.post("/signup", validationCreateUser, ctrl.signup);
router.post("/login", validationLoginUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.patch(
  "/avatars",
  guard,
  uploadAvatar.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
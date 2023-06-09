const express = require("express");
const {
  createUser,
  signInUserCtrl,
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  unblockUser,
  blockUser,
  handleRefreshToken,
  signOutUserCtrl,
} = require("../controller/userCtrl");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.post("/signin", signInUserCtrl);
router.get("/all-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/signout", signOutUserCtrl);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteSingleUser);
router.put("/update-user", authMiddleware, updateSingleUser);
router.put("/block-user/:id",authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin, unblockUser);


module.exports = router;

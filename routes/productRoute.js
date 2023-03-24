const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateSingleProduct,
  deleteSingleProduct,
} = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getSingleProduct);
router.put("/:id", authMiddleware, isAdmin, updateSingleProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleProduct);
router.get("/", getAllProduct);

module.exports = router;

const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDB_Id = require("../utils/validateMongoDB_Id");

// To create a product details

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      //slugify lowercase the string and update spaces with "-"
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// To update a product details
const updateSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  body = req.body;
  // validateMongoDB_Id(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateAProduct = await Product.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );
    res.json(updateAProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// To get a product details by id

const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const findAProduct = await Product.findById(id);
    res.json(findAProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// To get a All product details

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const findAllProduct = await Product.find();
    res.json(findAllProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// To delete a Product details

const deleteSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const deleteAProduct = await Product.findByIdAndDelete(id);
    res.json(deleteAProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateSingleProduct,
  deleteSingleProduct,
};

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
    const updateAProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });
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
    //Filtering
    const queryObject = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.map((i) => delete queryObject[i]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Product.find(JSON.parse(queryString));

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // PAGINATION

    // Extract the page number and limit from the query parameters
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // Extract the page number and limit from the query parameters
    const skip = (page - 1) * limit;

    
    // Constructing database query using the skip and limit values
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }    

    const findProducts = await query;
    res.json(findProducts);
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

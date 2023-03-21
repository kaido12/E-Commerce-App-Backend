const mongoose = require("mongoose");

const validateMongoDB_Id = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new Error("This is not a valid Id");
  }
};

module.exports = validateMongoDB_Id;
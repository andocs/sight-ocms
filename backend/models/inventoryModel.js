const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          const strippedString = value.replace(/\s+/g, '');
          if (strippedString.length < 2) {
            return false;
          }
          const twoChars = strippedString.substr(0, 2);
          const string = strippedString.substr(2);
          return /^[A-Za-z0-9]+$/.test(twoChars) || /^[A-Za-z0-9\s\S]*$/.test(string);
        },
        message: "Item Name must contain at least 2 non-space and non-special characters",
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, 
    },
    price: {
      type: Number,
      required: true,
      min: 1, 
    },
    description: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          const strippedString = value.replace(/\s+/g, '');
          if (strippedString.length < 2) {
            return false;
          }
          const twoChars = strippedString.substr(0, 2);
          const string = strippedString.substr(2);
          return /^[A-Za-z0-9]+$/.test(twoChars) || /^[A-Za-z0-9\s\S]*$/.test(string);
        },
        message: "Description must contain at least 2 non-space and non-special characters",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema, "inventoryDetails");

module.exports = Inventory;

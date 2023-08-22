export const validateItem = (itemDetails) => {
    const errors = [];
  
    const nameRegex = /^[a-zA-Z0-9\s]+$/;

    if (!itemDetails.itemName) {
      errors.push("Please add an item name!");
    } else if (
      itemDetails.itemName.trim().length < 2 ||
      !nameRegex.test(itemDetails.itemName.trim())
    ) {
      errors.push(
        "Item name must contain at least 2 non-special and non-whitespace characters!"
      );
    }
  
    if (!itemDetails.quantity) {
      errors.push("Please add a quantity of your item!");
    } else if (itemDetails.quantity<=0) {
      errors.push(
        "The item quantity must not be zero or lower!"
      );
    }

    if(!itemDetails.price){
      errors.push("Please add a price for your item!");
    } else if (itemDetails.price<=0) {
        errors.push(
            "The item price must not be zero or lower!"
        );
    }

    if(!itemDetails.description){
      errors.push("Please add a description for your item!");
    } else if (
      itemDetails.description.trim().length < 2 
    ) {
      errors.push(
        "Item description must contain at least 2 non-special and non-whitespace characters!"
      );
    }
    
return errors;
};
  
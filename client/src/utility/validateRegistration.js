export const validateRegistration = (userData) => {
    const errors = [];
  
    const nameRegex = /^[a-zA-Z0-9\s]+$/;

    if (!userData.fname) {
      errors.push("Please add your first name!");
    } else if (
      userData.fname.trim().length < 2 ||
      !nameRegex.test(userData.fname.trim())
    ) {
      errors.push(
        "First name must contain at least 2 non-special and non-whitespace characters!"
      );
    }
  
    if (!userData.lname) {
      errors.push("Please add your last name!");
    } else if (
      userData.lname.trim().length < 2 ||
      !nameRegex.test(userData.lname.trim())
    ) {
      errors.push(
        "Last name must contain at least 2 non-special and non-whitespace characters!"
      );
    }

    if(!userData.gender){
      errors.push("Please add your gender!");
    }
  
    if (!userData.email) {
      errors.push("Please add a valid email!");
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push("Please enter a valid email address!");
    }
  
    if (!userData.password) {
      errors.push("Please add a valid password!");
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(userData.password)
    ) {
      errors.push(
        "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, and one number!"
      );
    }
  
    if (!userData.contact) {
      errors.push("Please add a valid contact number!");
    } else if (!/^[0-9]{11}$/.test(userData.contact)) {
      errors.push("Please enter a valid 11-digit contact number!");
    }
  
    if (!userData.address) {
      errors.push("Please add your address!");
    } else if (
      userData.address.trim().length < 2 ||
      !nameRegex.test(userData.address.trim())
    ) {
      errors.push(
        "Address must contain at least 2 non-special and non-whitespace characters!"
      );
    }
  
    if (!userData.city) {
      errors.push("Please add your city!");
    } else if (
      userData.city.trim().length < 2 ||
      !nameRegex.test(userData.city.trim())
    ) {
      errors.push(
        "City must contain at least 2 non-special and non-whitespace characters!"
      );
    }
  
    if (!userData.province) {
      errors.push("Please add your province!");
    } else if (
      userData.province.trim().length < 2 ||
      !nameRegex.test(userData.province.trim())
    ) {
      errors.push(
        "Province must contain at least 2 non-special and non-whitespace characters!"
      );
    }
    
    return errors;
  };
  
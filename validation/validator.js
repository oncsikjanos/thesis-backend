/**
 * Validates email format using a regular expression
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates date of birth
 * @param {string} dateOfBirth - Date in YYYY-MM-DD format
 * @returns {Object} - { isValid: boolean, message: string }
 */
function isValidDateOfBirth(dateOfBirth) {
    // Check if the date string matches YYYY.MM.DD. format
    const dateRegex = /^\d{4}.\d{2}.\d{2}.$/;
    if (!dateRegex.test(dateOfBirth)) {
        return { 
            isValid: false, 
            message: "Date must be in YYYY.MM.DD. format" 
        };
    }

    // Convert to Date object
    const date = new Date(dateOfBirth);
    const now = new Date();

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return { 
            isValid: false, 
            message: "Invalid date" 
        };
    }

    // Check if date is in the future
    if (date > now) {
        return { 
            isValid: false, 
            message: "Date of birth cannot be in the future" 
        };
    }

    // Check if person is at least 16 years old
    const age = Math.floor((now - date) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 16) {
        return { 
            isValid: false, 
            message: "User must be at least 13 years old" 
        };
    }

    // Check if person is less than 100 years old
    if (age > 100) {
        return { 
            isValid: false, 
            message: "Invalid age (must be less than 120 years)" 
        };
    }

    return { 
        isValid: true, 
        message: "Valid date of birth" 
    };
}

function isValidName(name) { 
    return name.length >= 3;
}

function checkPasswordCriteria(password, confirmPassword) {
   if(!password?.length >= 8){
    return { 
        isValid: false, 
        message: "Password must be at least 8 characters long" 
    };
   }

   if(!/\d/.test(password)){
    return { 
        isValid: false, 
        message: "Password must contain at least one number" 
    };
   }

   if(!/[A-Z]/.test(password)){
    return { 
        isValid: false, 
        message: "Password must contain at least one uppercase letter" 
    };
   }

   if(!(password === confirmPassword)){
    console.log("password: " + password)
    console.log("passwordConfrim: " + confirmPassword)
    
    return { 
        isValid: false, 
        message: "Passwords do not match" 
    };
   }

   return { 
    isValid: true,
    message: "Everything is valid" };
  }


module.exports = {
    isValidEmail,
    isValidDateOfBirth,
    isValidName,
    checkPasswordCriteria
};
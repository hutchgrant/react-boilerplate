const _this = this;

exports.emailQuery = query => {
  let errors = [];
  errors = validateEmail(query, errors);
  return errors;
};

exports.tokenQuery = token => {
  let errors = [];
  errors = validateToken(token, errors);
  return errors;
};

validateName = (value, errors, name) => {
  var regex = /^[a-z0-9_-\w ]{2,30}$/i;
  if (!value) {
    errors.push('Invalid ' + name);
  } else {
    if (name == 'shipping address' || name == 'fullname') {
      regex = /^[a-z0-9_-\w ]{2,50}$/i;
    }
    if (!regex.test(value)) {
      errors.push('Invalid ' + name);
    }
  }
  return errors;
};

validateEmail = (value, errors) => {
  var regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!value) {
    errors.push('Invalid Email');
  } else {
    if (!regex.test(value)) {
      errors.push('Invalid Email');
    }
  }
  return errors;
};

validateToken = (value, errors) => {
  var regex = /^[a-z0-9_-\w ]{128}$/i;
  if (!value) {
    errors.push('Invalid Token');
  } else {
    if (!regex.test(value)) {
      errors.push('Invalid Token');
    }
  }
  return errors;
};

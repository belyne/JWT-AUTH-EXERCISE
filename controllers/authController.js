const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle Errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.messsage === 'Could not find the email') {
    errors.email = 'This email is not registered';
  }

  // incorrect password
  if (err.messsage === 'password does not match') {
    errors.password = 'Incorrect password';
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // invalid email
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;

}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge
  }); 
}

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });

  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
    
  }

}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });

  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });

  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
  res.redirect('/');
}
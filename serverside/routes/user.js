const express = require('express');
const router = express.Router()
const User = require('../model/user')
const passport = require('passport')
const CatchAsync = require('../utils/CatchAsync')
const { protect } = require("../middleware/authMiddleware")
const generateToken = require('../Config/generateToken')
const { storage } = require('../Config/index');
const { cloudinary } = require('../Config/index');
const multer = require('multer');
const upload = multer({ storage })


router.get('/search/user', protect, CatchAsync(async (req, res) => {
  const keyword = req.query.search
    ? {
      $or: [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
}))



router.get('/user/:id', CatchAsync(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));


router.post('/register', CatchAsync(async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
      res.status(400);
      throw new Error("Please Enter all the Fields");
    }

    const passwordRegix = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegix.test(password)) {
      console.log('password needs to be 123091823')
      return res.status(400).json({ message: "Password must contain atleast 1 Uppercase, 1 Number and a total of 8 Characters" })
    }
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      console.log('exesting username')
      return res.status(400).json({ message: "Username already exist" })
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      console.log('exesting email')
      return res.status(400).json({ message: "Email already exist" })
    }

    const user = new User({ firstName, lastName, email, username });
    const registeredUser = await User.register(user, password)
    if (registeredUser) {
      res.status(201).json({
        _id: registeredUser._id,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        username: registeredUser.username,
        email: registeredUser.email,
        pic: registeredUser.pic,
        token: generateToken(registeredUser._id)
      })
      console.log(registeredUser)
    } else {
      res.status(400);
      throw new Error("Failed to Create the User")
    }

  } catch (err) {
    console.log(err)
    res.status(500).send({ message: "Internal Server Error" })
  }
}))



router.post('/login', CatchAsync(async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    req.login(user, async (err) => {
      if (err) {
        return res.status(500).send({ message: 'Internal Server Error' });
      }

      // Generate the token
      const token = generateToken(user._id);

      // If login is successful, send the user data and token as a response
      return res.status(200).json({
        message: 'Login successful',
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id)
        },

      });
    });
  })(req, res, next);
}));


router.get('/profile/:id/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'There is no user found');
      return res.redirect('/');
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" })
  }

})

router.put('/profile/:id', upload.array('image'), CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({ message: "First name and last name are required" });
    return;
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Update the user's first name and last name
  user.firstName = firstName;
  user.lastName = lastName;

  if (req.files) {
    // If images were uploaded, process them and update the user's profile pictures
    const images = req.files.map((file) => {
      const { path, filename } = file;
      return { url: path, filename };
    });
    user.pic = images;
  }

  await user.save();
  res.status(200).json(user);
}));






module.exports = router;
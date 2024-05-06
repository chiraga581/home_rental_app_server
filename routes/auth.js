const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')


const User = require('../models/User')


//  configuration of multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/")   // start uploading file in the upload folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)  // use the original nam e
    }
})
const upload = multer({ storage })


//  User Register

/* USER REGISTER */
router.post("/register", upload.single("profileImage"), async (req, res) => {
    try {
        /* Take all information from the form */
        const { firstName, lastName, email, password } = req.body;

        /* The uploaded file is available as req.file */
        const profileImage = req.file;

        if (!profileImage) {
            return res.status(400).send("No file uploaded");
        }

        /* path to the uploaded profile photo */
        const profileImagePath = profileImage.path;

        /* Check if user exists */
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" });
        }

        /* Hass the password */
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        /* Create a new User */
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImagePath,
        });

        /* Save the new User */
        await newUser.save();

        /* Send a successful message */
        res
            .status(200)
            .json({ message: "User registered successfully!", user: newUser });
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({ message: "Registration failed!", error: err.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        
        //  check information from the form

        const { email, password } = req.body;

        //  check if user exists

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({ message: "User doesn't exists!" });
        }
        
        //  compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        //  generate JWT token

        const token = jwt.sign({id: user._id} , process.env.JWT_SECRET)
        delete user.password
        res.status(200).json({
            token,
            user,
            message: "user logged in successfully"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error.message,
            message: "Error occured in /server/routes/login"
        })
    }
})


module.exports = router

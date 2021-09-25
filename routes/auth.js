const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req,res) => {   
    try {
        //generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create new user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log("Error");
    }
});


//LOGIN
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).send("User not found!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send("Wrong Password!");

        res.status(200).send(user);
    } catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router;
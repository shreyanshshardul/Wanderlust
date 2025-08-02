const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");


router.get("/signup" , (req , res)=>{
    res.render("users/signup");
})

router.post("/signup", wrapAsync(userController.signup));


router.get("/login", (req, res) => {
 res.render("users/login");
});

router.post("/login" , saveRedirectUrl, passport.authenticate("local" , {failureRedirect : '/login', failureFlash : true}), userController.login);

router.get("/logout" , userController.logout);
module.exports = router;

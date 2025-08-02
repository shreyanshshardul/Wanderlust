const User = require("../model/user"); // ✅ ADD THIS LINE


module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registerUser = await User.register(newUser, password); // Register & hash password

        // Login user after registration using callback
        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success", `${username}, you are logged in successfully!`);
            res.redirect(req.session.redirectUrl || "/listings");

        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup"); // make sure this file exists
    }
};

module.exports.login = async(req , res)=>{
    let {username} = req.body;
    req.flash("success", `Welcome back to Wanderlust ${req.user.username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};


module.exports.logout = (req , res , next)=>{
    req.logout((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success" , "You are logout successfully!")
        res.redirect("/listings");
    })
};

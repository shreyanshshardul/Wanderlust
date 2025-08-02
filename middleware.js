  const listing = require("./model/listing.js");
  
  module.exports.isloggedin = (req , res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl =  req.originalUrl;
        req.flash("error" ,  "You much login to create new listing!");
       return  res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req  , res , next) =>{
    let {id} = req.params;
     let foundListing = await listing.findById(id);
      if(!foundListing.owner._id.equals(res.locals.currUser._id)){
             req.flash("error", "You are not the owner of this lisitng");
        return res.redirect(`/listings/${id}`);
      }
      next();
}
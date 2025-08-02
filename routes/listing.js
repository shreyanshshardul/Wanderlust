const express = require("express");
const router = express.Router();
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../model/listing.js");
const { isloggedin, isOwner } = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Validation Middleware
const validatelisting = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// ✅ INDEX — Show all listings
router.get("/", wrapAsync(ListingController.index));

// ✅ SEARCH — Search listings (must be BEFORE /:id)
router.get("/search", isloggedin, wrapAsync(ListingController.search));

// ✅ NEW FORM — Show form to create listing
router.get("/new", isloggedin, ListingController.rendernewform);

// ✅ CREATE — Save new listing
router.post(
    "/", 
    isloggedin, 
    validatelisting, 
    upload.single('listing[image]'),  
    wrapAsync(ListingController.createListing)
);
router.get("/search", isloggedin, wrapAsync(ListingController.search));
// ✅ DELETE — Delete a listing
router.delete("/:id", isloggedin, isOwner, wrapAsync(ListingController.deleteListing));

// ✅ EDIT FORM — Show form to edit listing
router.get(
    "/:id/edit", 
    isloggedin, 
    isOwner, 
    upload.single('listing[image]'), 
    validatelisting, 
    wrapAsync(ListingController.editListing)
);

// ✅ UPDATE — Update a listing
router.put(
    "/:id",
    isloggedin,
    isOwner,
    upload.single("image"), 
    validatelisting,
    wrapAsync(ListingController.updateListing)
);

// ✅ SHOW — Show one listing with reviews (keep this last)
router.get("/:id", wrapAsync(ListingController.showListing));

module.exports = router;

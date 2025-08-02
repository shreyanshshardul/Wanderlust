// 📦 Import your Listing model
const Listing = require("../model/listing");

// 🌐 INDEX - Show all listings
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
};

// 📝 RENDER NEW LISTING FORM
module.exports.rendernewform = (req, res) => {
    res.render("listings/new");
};

// 🔍 SHOW LISTING BY ID
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "review",
            populate: {
                path: "author",
                select: "username"
            }
        });

    if (!listings) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listings });
};

// ➕ CREATE NEW LISTING
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        const { path: url, filename } = req.file;
        newListing.image = { url, filename };
    }

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
};

// 🖊️ EDIT LISTING FORM
module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);
    if (!foundListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { foundListing });
};

// 🗑️ DELETE LISTING
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};

// 🔁 UPDATE LISTING
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const existingListing = await Listing.findById(id);

    const updatedData = {
        ...req.body.listing,
        image: existingListing.image // retain existing image if no new file
    };

    await Listing.findByIdAndUpdate(id, updatedData);

    if (req.file) {
        const { path: url, filename } = req.file;
        existingListing.image = { url, filename };
        await existingListing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// 🔍 SEARCH LISTINGS BY LOCATION
module.exports.search = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Please enter a search term.");
        return res.redirect("/listings");
    }

    const matchedListings = await Listing.find({
        location: { $regex: new RegExp(q, "i") } // case-insensitive
    });

    if (matchedListings.length > 0) {
        req.flash("success", `Found ${matchedListings.length} matching listings.`);
        return res.render("listings/searchResult", {
            listings: matchedListings,
            query: q
        });
    } else {
        req.flash("error", "No listings found for that location.");
        return res.redirect("/listings");
    }
};

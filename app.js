// ===== Load Environment Variables =====
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ===== Imports =====
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const listing = require("./model/listing.js");
const User = require("./model/user.js");
const { listingSchema } = require("./Schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const port = process.env.PORT || 8080; // ✅ Use dynamic port for Render

// ===== Connect to MongoDB =====
mongoose
  .connect(process.env.ATLASDB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== View Engine Setup =====
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== Static & Parser Middleware =====
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

// ===== MongoDB Session Store =====
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: { 
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});
store.on("error", (e) => {
  console.log("❌ MongoStore Error:", e);
});

// ===== Session & Flash Setup =====
const sessionConfig = {
  store,
  secret: "mysupersceretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());

// ===== Passport Setup =====
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===== Global Variables for Views =====
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ===== Logger (Optional) =====
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ===== Routes =====
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ===== Cookie & Flash Test Routes (Optional) =====
app.get("/getcookies", (req, res) => {
  res.cookie("Name", "Shreyansh");
  res.cookie("Phone", "7766867474");
  res.send("Cookies set!");
});

app.get("/greet", (req, res) => {
  const { Name } = req.cookies;
  res.send(`Hi, ${Name}`);
});

app.get("/test-flash", (req, res) => {
  req.flash("success", "🎉 Flash is working!");
  res.redirect("/listings");
});

app.get("/test", (req, res) => {
  req.flash("success", "Flash success chal gaya!");
  req.flash("error", "Flash error chal gaya!");
  res.redirect("/listings");
});

// ===== ✅ Root Route for Render =====
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});

// ===== Start Server =====
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

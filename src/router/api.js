const express = require("express");
const AuthVerifyMiddleware = require("../middleware/AuthVerifyMiddleware");
const UserController = require("../controller/UserController");
const AdminController = require("../controller/AdminController");
const ProductController = require("../controller/ProductController");
const { upload } = require("../utility/FileUpload");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// *********** Admin ************ //

//! Admin Login API
router.post("/admin-login", AdminController.login);

//! Verify Admin
router.post("/verify-admin", AdminController.AdminVerifyData);

//! Get single Admin Profiler API
router.get(
  "/get-single-admin/:email",
  AuthVerifyMiddleware,
  AdminController.getSingleAdminProfile
);

//! Get All Admin Profiler API
router.get(
  "/get-all-admin",
  AuthVerifyMiddleware,
  AdminController.getAllAdminProfile
);

//! Delete user Profiler API
router.delete(
  "/delete-profile/:email",
  AuthVerifyMiddleware,
  UserController.profileDelete
);

// *********** User ************ //

//! Registration API
router.post("/registration", UserController.registration);

//! Login API
router.post("/login", UserController.login);

//! Verify User
router.post(
  "/verify-user",
  AuthVerifyMiddleware,
  UserController.EmailVerifyData
);

//! Recover Verify Email
router.get("/recoverVerifyEmail/:email", UserController.RecoverVerifyEmail);

//! Recover Verify OTP
router.get("/recoverVerifyOTP/:email/:otp", UserController.RecoverVerifyOTP);

//! Recover Reset Password
router.post("/recoverResetPassword", UserController.RecoverResetPassword);

//! Get Single User Profiler API
router.get(
  "/single-profile/:email",
  AuthVerifyMiddleware,
  UserController.getSingleUserProfile
);
//! Get All User Profiler API By Pagination
router.get(
  "/getAllUserProfile/:pageNo",
  AuthVerifyMiddleware,
  UserController.getAllUserProfile
);
//! Update user Profiler API
router.post(
  "/update-profile/:email",
  AuthVerifyMiddleware,
  UserController.profileUpdate
);

// *********** Product ************ //

// ! Create Product
router.post(
  "/create-product",
  AuthVerifyMiddleware,
  ProductController.createProduct
);
// ! Read Single Product
router.get("/read-single-product/:id", ProductController.ReadSingleProduct);

// ! Update Product
router.post(
  "/update-product/:id",
  AuthVerifyMiddleware,
  ProductController.updateProduct
);

// ! Delete Product
router.delete(
  "/delete-product/:id",
  AuthVerifyMiddleware,
  ProductController.deleteProduct
);

// ! Read All Product
router.get("/read-all-ads", ProductController.getAllAds);
// ! Read All Product By Pagination
router.get("/read-all-product/:pageNo", ProductController.getAllProduct);

// ! Read All Product Approve by Admin
router.get(
  "/read-all-product-by-approve/:pageNo",
  ProductController.getAllProduct__ByApprove__Admin
);

// ! Read All Product By Single User
router.get(
  "/read-all-product-single-user/:email",
  AuthVerifyMiddleware,
  ProductController.getSingleUSerAllProduct
);
// ! Read Pagination Product By Single User
router.get(
  "/read-all-product-single-user-pagination/:email/:pageNo",
  AuthVerifyMiddleware,
  ProductController.paginationAds
);

// ! Approve single Product by Admin
router.post(
  "/approve-single-product/:id",
  AuthVerifyMiddleware,
  ProductController.approveProduct
);

//! Filter Search Product By Districts, Category, SubDistricts
router.get(
  "/filter/:district/:subDistricts/:category/:pageNo",
  ProductController.FilterProductSearch
);
//! Filter Search Product By Category
router.get(
  "/filter-category/:category/:pageNo",
  ProductController.FilterProductSearch_Category
);
//!  Search Product By Pagination API
router.get("/search/:searchKeyword/:pageNo", ProductController.searchProduct);

// ! File Uploads
router.post("/upload", upload.array("img", 5), (req, res) => {
  console.log(req.files);
  res.status(200).json({ status: "Success", data: req.files });
});

// ! Remove Upload File

router.post("/remove", (req, res) => {
  let ImageName = req.body["filename"];
  const filePath = path.join(__dirname, `../../uploads/${ImageName}`);
  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(200).json({ status: "Fail", data: err });
    } else {
      res.status(200).json({ status: "Success" });
    }
  });
});

module.exports = router;

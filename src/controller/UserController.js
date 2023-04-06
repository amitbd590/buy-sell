const UserModel = require("../model/UserModel");
const OTPModel = require("../model/OTPModel");
const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const SendEmailUtility = require("../utility/SendEmailUtility");

//! User Registration API
exports.registration = async (req, res) => {
  let reqBody = req.body;
  try {
    let result = await UserModel.create(reqBody);
    res.status(200).json({ status: "Success", data: result });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! User Login API
exports.login = async (req, res) => {
  let reqBody = req.body;

  try {
    let result = await UserModel.aggregate(
      [
        { $match: reqBody },
        {
          $project: {
            email: 1,
          },
        },
      ],
      (error, data) => {
        if (data.length > 0) {
          let Payload = {
            expiresIn: "365d",
            // exp: Math.floor(Date.now() / 1000) + 365 * 60 * 60,
            data: data[0]["email"],
          };
          let token = JWT.sign(Payload, `${process.env.JWT_AUTH_SECRET_KEY}`);
          res
            .status(200)
            .json({ status: "Success", Token: token, data: data[0] });
        } else {
          res.status(200).json({ status: "Unauthorized", data: error });
        }
      }
    );
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Verify User
exports.EmailVerifyData = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = reqBody.email;
    let password = reqBody.password;
    let data = await UserModel.aggregate([
      { $match: { email: email, password: password } },
    ]);

    if (data.length > 0) {
      res.status(200).json({ status: "Success", data: data[0] });
    } else {
      res.status(200).json({ status: "Unauthorized ", data: data });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", error: e });
  }
};

//! Get Single User Profile API
exports.getSingleUserProfile = async (req, res) => {
  let email = req.params.email;
  try {
    const result = await UserModel.aggregate([
      { $match: { email: email } },
      {
        $project: {
          email: 1,
          firstName: 1,
          lastName: 1,
          userRoles: 1,
          age: 1,
          mobile: 1,
          gender: 1,
          image: 1,
          password: 1,
          location: 1,
          createDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$createDate" },
          },
        },
      },
    ]);
    if (result.length > 0) {
      res.status(200).json({ status: "Success", data: result });
    } else {
      res.status(200).json({ status: "Unauthorized", data: result });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", Result: e });
  }
};
//! Get All User Profile Pagination API
exports.getAllUserProfile = async (req, res) => {
  try {
    let pageNo = Number(req.params.pageNo);
    let perPage = 5;
    let skipRow = (pageNo - 1) * perPage;

    let data = await UserModel.aggregate([
      { $match: { userRoles: "User" } },
      { $sort: { _id: -1 } },
      {
        $facet: {
          Total: [{ $count: "count" }],

          Row: [
            {
              $project: {
                email: 1,
                firstName: 1,
                lastName: 1,
                userRoles: 1,
                age: 1,
                mobile: 1,
                gender: 1,
                image: 1,
                password: 1,
                location: 1,
                createDate: {
                  $dateToString: { format: "%d-%m-%Y", date: "$createDate" },
                },
              },
            },

            { $skip: skipRow },
            { $limit: perPage },
          ],
        },
      },
    ]);

    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", error: e });
  }
};

//! User Profile Update
exports.profileUpdate = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = req.params.email;
    let query = { email: email };
    let result = await UserModel.updateOne(query, reqBody);
    res.status(200).json({ status: "Success", data: result });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! User Profile Delete
exports.profileDelete = async (req, res) => {
  try {
    let email = req.params.email;
    let query = { email: email };
    let result = await UserModel.remove(query);
    res.status(200).json({ status: "Success", data: result });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Recover Verify Email

exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  let OTPCode = Math.floor(100000 + Math.random() * 900000);

  try {
    // Email Account Query
    let UserCount = await UserModel.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);

    if (UserCount.length > 0) {
      //Create OTP
      let CreateOTP = await OTPModel.create({
        email: email,
        otp: OTPCode,
      });
      // Send Email
      let SendEmail = await SendEmailUtility(
        email,
        "Your PIN Code is =" + OTPCode,
        "Task Manager PIN Verification"
      );

      res.status(200).json({ status: "Success", data: SendEmail });
    } else {
      res.status(200).json({ status: "Fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", data: "Wrong Wrong" });
  }
};

//! Recover Verify OTP
exports.RecoverVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;
  let Update = 1;

  try {
    let OTPCount = await OTPModel.aggregate([
      { $match: { email: email, otp: OTPCode, status: status } },
      { $count: "total" },
    ]);

    if (OTPCount.length > 0) {
      let OTPUpdate = await OTPModel.updateOne(
        {
          email: email,
          otp: OTPCode,
          status: status,
        },
        {
          email: email,
          otp: OTPCode,
          status: Update,
        }
      );
      res.status(200).json({ status: "Success", data: OTPUpdate });
    } else {
      res.status(200).json({ status: "Fail", data: "Invalid OTP Code" });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Recover Reset Password

exports.RecoverResetPassword = async (req, res) => {
  let email = req.body["email"];
  let OTPCode = req.body["OTP"];
  let NewPass = req.body["password"];

  let statusUpdate = 1;
  try {
    let OTPUsedCount = await OTPModel.aggregate([
      { $match: { email: email, otp: OTPCode, status: statusUpdate } },
      { $count: "total" },
    ]);
    if (OTPUsedCount.length > 0) {
      let PassUpdate = await UserModel.updateOne(
        { email: email },
        { password: NewPass }
      );
      res.status(200).json({ status: "Success", data: PassUpdate });
    } else {
      res.status(200).json({ status: "Fail", data: "Something is Wrong!" });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

const AdminModel = require("../model/AdminModel");
const JWT = require("jsonwebtoken");

//! User Login API
exports.login = async (req, res) => {
  let reqBody = req.body;

  try {
    let result = await AdminModel.aggregate(
      [
        { $match: reqBody },
        {
          $project: {
            email: 1,
            userRoll: 1,
            image: 1,
            password: 1,
          },
        },
      ],
      (error, data) => {
        if (data.length > 0) {
          let Payload = {
            exp: Math.floor(Date.now() / 1000) + 365 * 60 * 60,
            data: data[0]["email"],
          };
          let token = JWT.sign(Payload, `${process.env.JWT_AUTH_SECRET_KEY}`);
          res
            .status(200)
            .json({ status: "Success", Token: token, Result: data[0] });
        } else {
          res.status(200).json({ status: "Unauthorized" });
        }
      }
    );
  } catch (e) {
    res.status(200).json({ status: "Fail", Result: e });
  }
};
//! Verify User
exports.AdminVerifyData = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = reqBody.email;
    let password = reqBody.password;
    let data = await AdminModel.aggregate([
      { $match: { email: email, password: password } },
    ]);

    if (data.length > 0) {
      res.status(200).json({ status: "Success", data: data[0] });
    } else {
      res.status(200).json({ status: "Unauthorized", data: data });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", error: e });
  }
};

//! Get Single Admin  Profile API
exports.getSingleAdminProfile = async (req, res) => {
  let email = req.params.email;
  try {
    let result = await AdminModel.aggregate([
      { $match: { email: email } },
      {
        $project: {
          email: 1,
          userRoll: 1,
          image: 1,
          password: 1,
        },
      },
    ]);

    res.status(200).json({ status: "Success", Result: result });
  } catch (e) {
    res.status(200).json({ status: "Fail", Result: e });
  }
};

//! Get All Admin  Profile API
exports.getAllAdminProfile = async (req, res) => {
  try {
    let result = await AdminModel.aggregate([
      {
        $project: {
          email: 1,
          userRoll: 1,
          image: 1,
          password: 1,
          createDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$createDate" },
          },
        },
      },
    ]);

    res.status(200).json({ status: "Success", data: result });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

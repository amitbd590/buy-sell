const ProductModel = require("../model/ProductModel");
const ObjectId = require("mongoose").Types.ObjectId;
//! Product Create API
exports.createProduct = async (req, res) => {
  try {
    let reqBody = req.body;
    let data = await ProductModel.create(reqBody);
    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Read Single Product API
exports.ReadSingleProduct = async (req, res) => {
  try {
    let data = await ProductModel.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $project: {
          email: 1,
          productName: 1,
          condition: 1,
          Authenticity: 1,
          Brand: 1,
          Model: 1,
          Edition: 1,
          Feature: 1,
          Description: 1,
          Price: 1,
          Negotiable: 1,
          Photo: 1,
          ClientName: 1,
          mobileNumber: 1,
          Districts: 1,
          SubDistricts: 1,
          Category: 1,
          Approve: 1,
          createDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$createDate" },
          },
        },
      },
    ]);
    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Product Update API
exports.updateProduct = async (req, res) => {
  try {
    let reqBody = req.body;
    let id = req.params.id;
    let email = reqBody.email;
    let query = { _id: id, email: email };
    let data = await ProductModel.updateOne(query, reqBody);
    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Product Delete API
exports.deleteProduct = async (req, res) => {
  try {
    let reqBody = req.body;
    let id = req.params.id;
    let query = { _id: id };
    let data = await ProductModel.remove(query);
    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Get All Product API
exports.getAllAds = async (req, res) => {
  try {
    let data = await ProductModel.aggregate([
      { $sort: { _id: -1 } },
      { $match: { Approve: true } },
      {
        $project: {
          email: 1,
          productName: 1,
          condition: 1,
          Category: 1,
          Authenticity: 1,
          Brand: 1,
          Model: 1,
          Edition: 1,
          Feature: 1,
          Description: 1,
          Price: 1,
          Negotiable: 1,
          Photo: 1,
          ClientName: 1,
          SubDistricts: 1,
          mobileNumber: 1,
          Approve: 1,
          createDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$createDate" },
          },
        },
      },
    ]);

    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", error: e });
  }
};
//! Get All Product Pagination API
exports.getAllProduct = async (req, res) => {
  try {
    let pageNo = Number(req.params.pageNo);
    let perPage = 8;
    let skipRow = (pageNo - 1) * perPage;
    let data = await ProductModel.aggregate([
      { $sort: { _id: -1 } },
      {
        $facet: {
          Total: [{ $count: "count" }],

          Row: [
            {
              $project: {
                email: 1,
                productName: 1,
                condition: 1,
                Authenticity: 1,
                Brand: 1,
                Model: 1,
                Edition: 1,
                Feature: 1,
                Description: 1,
                Price: 1,
                Negotiable: 1,
                Photo: 1,
                ClientName: 1,
                SubDistricts: 1,
                mobileNumber: 1,
                Approve: 1,
                Category: 1,
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
//! Get All Product API By Single User
exports.getSingleUSerAllProduct = async (req, res) => {
  let email = req.params.email;
  try {
    let data = await ProductModel.aggregate([
      { $match: { email: email } },
      {
        $project: {
          email: 1,
          productName: 1,
          condition: 1,
          Authenticity: 1,
          Brand: 1,
          Model: 1,
          Edition: 1,
          Feature: 1,
          Description: 1,
          Price: 1,
          Negotiable: 1,
          Photo: 1,
          ClientName: 1,
          SubDistricts: 1,
          mobileNumber: 1,
          Approve: 1,
          Category: 1,
          createDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$createDate" },
          },
        },
      },
    ]);
    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Get All Product By Approve Admin
exports.getAllProduct__ByApprove__Admin = async (req, res) => {
  try {
    let pageNo = Number(req.params.pageNo);
    let perPage = 8;
    let skipRow = (pageNo - 1) * perPage;
    let data = await ProductModel.aggregate([
      { $sort: { _id: -1 } },
      { $match: { Approve: true } },
      {
        $facet: {
          Total: [{ $count: "count" }],

          Row: [
            {
              $project: {
                email: 1,
                productName: 1,
                condition: 1,
                Authenticity: 1,
                Brand: 1,
                Model: 1,
                Edition: 1,
                Feature: 1,
                Description: 1,
                Price: 1,
                Negotiable: 1,
                Photo: 1,
                ClientName: 1,
                Districts: 1,
                SubDistricts: 1,
                mobileNumber: 1,
                Approve: 1,
                Category: 1,
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

//! Pagination Ads API

exports.paginationAds = async (req, res) => {
  try {
    let pageNo = Number(req.params.pageNo);
    let perPage = 5;
    let skipRow = (pageNo - 1) * perPage;
    let email = req.params.email;

    let data = await ProductModel.aggregate([
      { $match: { email: email } },
      { $sort: { _id: -1 } },
      {
        $facet: {
          Total: [{ $count: "count" }],

          Row: [
            {
              $project: {
                email: 1,
                productName: 1,
                condition: 1,
                Authenticity: 1,
                Brand: 1,
                Model: 1,
                Edition: 1,
                Feature: 1,
                Description: 1,
                Price: 1,
                Negotiable: 1,
                Photo: 1,
                ClientName: 1,
                SubDistricts: 1,
                mobileNumber: 1,
                Approve: 1,
                Category: 1,
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

//! Filter Search By Districts, SubDistricts, Category
exports.FilterProductSearch = async (req, res) => {
  try {
    let Districts = req.params.district;
    let SubDistricts = req.params.subDistricts;
    let Category = req.params.category;
    let pageNo = Number(req.params.pageNo);
    let perPage = 8;
    let skipRow = (pageNo - 1) * perPage;

    let data = await ProductModel.aggregate([
      {
        $match: {
          $and: [
            { Districts: Districts },
            { SubDistricts: SubDistricts },
            { Category: Category },
            { Approve: true },
          ],
        },
      },
      { $sort: { _id: -1 } },
      {
        $facet: {
          Total: [{ $count: "count" }],

          Row: [
            {
              $project: {
                email: 1,
                productName: 1,
                condition: 1,
                Authenticity: 1,
                Brand: 1,
                Model: 1,
                Edition: 1,
                Feature: 1,
                Description: 1,
                Price: 1,
                Negotiable: 1,
                Photo: 1,
                ClientName: 1,
                Districts: 1,
                SubDistricts: 1,
                mobileNumber: 1,
                Approve: 1,
                Category: 1,
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

//! Filter Search By Category
exports.FilterProductSearch_Category = async (req, res) => {
  try {
    let Category = req.params.category;
    let pageNo = Number(req.params.pageNo);
    let perPage = 8;
    let skipRow = (pageNo - 1) * perPage;

    let data = await ProductModel.aggregate([
      {
        $match: {
          Category: Category,
          Approve: true,
        },
      },
      { $sort: { _id: -1 } },
      {
        $facet: {
          Total: [{ $count: "count" }],

          Row: [
            {
              $project: {
                email: 1,
                productName: 1,
                Category: 1,
                condition: 1,
                Authenticity: 1,
                Brand: 1,
                Model: 1,
                Edition: 1,
                Feature: 1,
                Description: 1,
                Price: 1,
                Negotiable: 1,
                Photo: 1,
                ClientName: 1,
                Districts: 1,
                SubDistricts: 1,
                mobileNumber: 1,
                Approve: 1,
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

//! Approve Single Product By Admin API
exports.approveProduct = async (req, res) => {
  try {
    let reqBody = req.body;
    let id = req.params.id;
    let query = { _id: id };
    let data = await ProductModel.updateOne(query, reqBody);
    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

//! Product Search Request  API

exports.searchProduct = async (req, res) => {
  try {
    let pageNo = Number(req.params.pageNo);
    let perPage = 8;
    let searchValue = req.params.searchKeyword;
    let skipRow = (pageNo - 1) * perPage;
    let data;

    if (searchValue !== "0") {
      let SearchRgx = { $regex: searchValue, $options: "i" };
      let SearchQuery = {
        $or: [{ productName: SearchRgx }],
      };

      data = await ProductModel.aggregate([
        {
          $facet: {
            Total: [{ $match: SearchQuery }, { $count: "count" }],
            Rows: [
              { $match: SearchQuery },
              { $skip: skipRow },
              { $limit: perPage },
            ],
          },
        },
      ]);
    } else {
      data = await productModel.aggregate([
        {
          $facet: {
            Total: [{ $count: "count" }],
            Rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    }

    res.status(200).json({ status: "Success", data: data });
  } catch (e) {
    res.status(200).json({ status: "Fail", error: e });
  }
};

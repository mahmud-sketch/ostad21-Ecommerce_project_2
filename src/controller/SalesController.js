const SalesModel = require("../model/SalesModel");

exports.totalRevenue = async (req, res) => {
  try {
    const pr = await SalesModel.find({});
    // console.log(pr);
    const totalRevenue = await SalesModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$quantity", "$price"] },
          },
        },
      },
    ]);
    // console.log(totalRevenue);

    if (totalRevenue.length) {
      res.status(200).json({
        status: "successfull",
        totalRevenue: totalRevenue[0].totalRevenue,
      });
    } else {
      res
        .status(404)
        .json({ status: "failed", message: "No sales data found." });
    }
  } catch (error) {
    res.status(500).json({ error });
    console.log(error.message);
  }
};
exports.quantityByProduct = async (req, res) => {
  try {
    const totalQuantityByProduct = await SalesModel.aggregate([
      {
        $group: {
          _id: "$product",
          totalQuantity: {
            $sum: "$quantity",
          },
        },
      },
    ]);

    if (totalQuantityByProduct.length > 0) {
      res.status(200).json({ status: "successfull", totalQuantityByProduct });
    } else {
      res
        .status(404)
        .json({ status: "failed", message: "No quantity data found." });
    }
  } catch (error) {
    res.status(500).json({
      error:
        "An error occurred while calculating total quantity sold by product.",
    });
  }
};
exports.topProducts = async (req, res) => {
  try {
    const topProducts = await SalesModel.aggregate([
      {
        $group: {
          _id: "$product",
          totalRevenue: {
            $sum: { $multiply: ["$quantity", "$price"] },
          },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    if (topProducts.length > 0) {
      res.status(200).json({ status: "successfull", topProducts });
    } else {
      res
        .status(404)
        .json({ status: "failed", message: "No sales data found." });
    }
  } catch (error) {
    res.status(500).json({
      error:
        "An error occurred while retrieving top products by total revenue.",
    });
  }
};
exports.averagePrice = async (req, res) => {
  try {
    const averagePrice = await SalesModel.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: { $multiply: ["$quantity", "$price"] },
          },
          totalQuantity: {
            $sum: "$quantity",
          },
        },
      },
      {
        $project: {
          _id: 0,
          averagePrice: { $divide: ["$totalPrice", "$totalQuantity"] },
        },
      },
    ]);

    if (averagePrice) {
      res.status(200).json({
        status: "successfill",
        averagePrice: averagePrice,
      });
    } else {
      res
        .status(404)
        .json({ status: "failed", message: "No sales data found." });
    }
  } catch (error) {
    res.status(500).json({
      error:
        "An error occurred while calculating the average price of products sold.",
    });
  }
};
exports.revenueByMonth = async (req, res) => {
  try {
    const revenueByMonth = await SalesModel.aggregate([
      {
        $group: {
          _id: {
            date: { $month: "$date" },
          },
          totalRevenue: { $multiply: ["$quantity", "$price"] },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",

          totalRevenue: 1,
        },
      },
    ]);

    if (revenueByMonth) {
      res.json(revenueByMonth);
    } else {
      res.status(404).json({ message: "No sales data found." });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while calculating revenue by month and year.",
    });
  }
};
exports.highestQuantitySold = async (req, res) => {
  try {
    const highestQuantitySold = await SalesModel.aggregate([
      {
        $group: {
          _id: "$date",
          maxQuantity: { $max: "$quantity" },
        },
      },
      {
        $sort: { maxQuantity: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    if (highestQuantitySold.length > 0) {
      const highestQuantityDate = highestQuantitySold[0]._id;
      const highestQuantity = highestQuantitySold[0].maxQuantity;
      // console.log(highestQuantityDate, highestQuantity);

      const productWithHighestQuantity = await SalesModel.findOne({
        date: highestQuantityDate,
        quantity: highestQuantity,
      });

      res.json(productWithHighestQuantity);
    } else {
      res.status(404).json({ message: "No sales data found." });
    }
  } catch (error) {
    res.status(500).json({
      error:
        "An error occurred while finding the product with the highest quantity sold.",
    });
  }
};
exports.departmentSalaryExpense = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "departmentSalaryExpense",
  });
};

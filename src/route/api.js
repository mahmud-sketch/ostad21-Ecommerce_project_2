const express = require("express");
const router = express.Router();

const SalesController = require("../controller/SalesController");

// API Routing End Point

router.get("/sales/total-revenue", SalesController.totalRevenue);
router.get("/sales/quantity-by-product", SalesController.quantityByProduct);
router.get("/sales/top-products", SalesController.topProducts);
router.get("/sales/average-price", SalesController.averagePrice);
router.get("/sales/revenue-by-month", SalesController.revenueByMonth);
router.get("/sales/highest-quantity-sold", SalesController.highestQuantitySold);
router.get(
  "/sales/department-salary-expense",
  SalesController.departmentSalaryExpense
);

module.exports = router;

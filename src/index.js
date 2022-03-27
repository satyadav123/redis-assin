const express = require("express");

const productController = require("./controllers/product.controllers");

const app = express();

app.use(express.json());

app.use("/product", productController);

module.exports = app;

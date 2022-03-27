const express = require("express");

const client = require("../configs/redis");

const product = require("../models/product.models");

const router = express.Router();

router.post("", async (req, res) => {
  try {
    const products = await product.create(req.body);

    const product= await product.find().lean().exec();

    client.set("product", JSON.stringify(product));

    return res.status(201).send(products);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("", async (req, res) => {
  try {
    client.get("product", async function (err, fetchedproduct) {
      if (fetchedproduct) {
        const product = JSON.parse(fetchedproduct);

        return res.status(200).send({ product, redis: true });
      } else {
        try {
          const product = await product.find().lean().exec();

          client.set("product", JSON.stringify(product));

          return res.status(200).send({ product, redis: false });
        } catch (err) {
          return res.status(500).send({ message: err.message });
        }
      }
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    client.get(`product.${req.params.id}`, async function (err, fetchedproduct) {
      if (fetchedproduct) {
        const product = JSON.parse(fetchedproduct);

        return res.status(200).send({ product, redis: true });
      } else {
        try {
          const product= await product.findById(req.params.id).lean().exec();

          client.set(`product.${req.params.id}`, JSON.stringify(product));

          return res.status(200).send({ product, redis: false });
        } catch (err) {
          return res.status(500).send({ message: err.message });
        }
      }
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const products = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    const product = await product.find().lean().exec();

    client.set(`product.${req.params.id}`, JSON.stringify(product));
    client.set("product", JSON.stringify(product));

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const products = await product.findByIdAndDelete(req.params.id).lean().exec();

    const product = await product.find().lean().exec();

    client.del(`product.${req.params.id}`);
    client.set("product", JSON.stringify(product));

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;

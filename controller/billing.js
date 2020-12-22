const send = require("../helper/response.js");
const createError = require("http-errors");
const mongoose = require("mongoose");
const Billing = require("../model/billing");
const { logger } = require("../helper/logger.js");

exports.getAll = async (req, res, next) => {
  try {
    const result = await Billing.find({}, { __v: 0 });
    if (!result) {
      throw createError(404, "Billing does not exist");
    }
    send.json(res, result);
  } catch (err) {
    console.log(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const result = await Billing.findById(req.params.id, { __v: 0 });
    //const result = await Billing.findOne({ id: req.params.id});
    if (!result) {
      // send.json(res, { message: "Billing not found" }, 404);
      throw createError(404, "Billing does not exist");
    }
    send.json(res, result);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(createError(400, "Invalid Billing id"));
      return;
    }
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const result = await Billing.findByIdAndDelete(req.params.id);
    if (!result) {
      throw createError(404, "Billing does not exist");
    }
    send.json(res, result);
  } catch (err) {
    logger.error(err);
    if (err instanceof mongoose.CastError) {
      next(createError(400, "Invalid Billing id"));
      return;
    }
    next(err);
  }
};

exports.updateById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const result = await Billing.findByIdAndUpdate(id, updates, options);
    if (!result) {
      throw createError(404, "Billing does not exist");
    }
    send.json(res, result);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(createError(400, "Invalid Billing id"));
      return;
    }
    next(err);
  }
};

exports.create = async (req, res, next) => {
  //promise based
  /* const Billing = new Billing({
    name: req.body.name,
    price: req.body.price,
  });
  Billing
    .save()
    .then(() => {
      req.logger.info("created succesfully");
      send.json(res, Billing);
    })
    .catch((err) => req.logger.info(err));
    */
  try {
    console.log(req.body);
    const billing = new Billing(req.body);
    const result = await billing.save();
    send.json(res, result);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(createError(422, err.message));
      return;
    }
    next(err);
  }
};

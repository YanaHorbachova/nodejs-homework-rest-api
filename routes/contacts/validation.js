const Joi = require("joi");
const mongoose = require("mongoose");
const HttpCode = require("../../helpers/constants");

const schemaAddContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  phone: Joi.string().min(10).max(15).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua", "ru"] },
    })
    .required(),
    favorite: Joi.boolean().optional(),
});

const schemaQueryContact = Joi.object({
  limit: Joi.number().integer().min(1).max(15).optional(),
  offset: Joi.number().integer().min(0).optional(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),

  phone: Joi.string().min(10).max(15).optional(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua", "ru"] },
    })
    .optional(),
}).or("name", "phone", "email");

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    return next();
  } catch (err) {
    console.log(err);
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Missing fields: field ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports = {
  validationCreateContact: async (req, res, next) => {
    return await validate(schemaAddContact, req.body, next);
  },
  validationUpdateContact: async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, next);
  },
  validationQueryContact: async (req, res, next) => {
    return await validate(schemaQueryContact, req.query, next);
  },
  validationUpdateContactStatus: async (req, res, next) => {
    return await validate(schemaUpdateStatusContact, req.body, next);
  },
  validationObjectId: async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: "Invalid object Id",
      });
    }
    next();
  },
};
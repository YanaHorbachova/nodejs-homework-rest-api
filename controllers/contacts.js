const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
  } = require("../model/contacts");
  const HttpCode = require("../helpers/constants");
  
  const getAll = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contacts = await listContacts(userId, req.query);
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: {
          contacts,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  const getById = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await getContactById(userId, req.params.contactId);
      console.log(contact);
      if (contact) {
        return res.json({
          status: "success",
          code: HttpCode.OK,
          data: {
            contact,
          },
        });
      } else {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not found",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  
  const create = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await addContact(userId, req.body);
      console.log(contact);
      return res.status(HttpCode.CREATED).json({
        status: "success",
        code: HttpCode.CREATED,
        data: {
          contact,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  const update = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await updateContact(userId, req.params.contactId, req.body);
      console.log(contact);
      if (contact) {
        return res.json({
          status: "success",
          code: HttpCode.OK,
          data: {
            contact,
          },
        });
      } else {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not found",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  
  const remove = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await removeContact(userId, req.params.contactId);
      console.log(contact);
      if (contact) {
        return res.json({
          status: "success",
          code: HttpCode.OK,
          message: "contact deleted",
        });
      } else {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not found",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  
  const updateStatus = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const contact = await updateContact(userId, req.params.contactId, req.body);
      console.log(contact);
      if (contact) {
        return res.json({
          status: "success",
          code: HttpCode.OK,
          data: {
            contact,
          },
        });
      } else {
        return res.status(HttpCode.NOT_FOUND).json({
          status: "error",
          code: HttpCode.NOT_FOUND,
          message: "Not found",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    getAll,
    getById,
    create,
    update,
    updateStatus,
    remove,
  };
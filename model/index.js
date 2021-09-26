const contacts = require("./schemas/contact");

const listContacts = async (userId, query) => {
  const { favorite = null, limit = 20, offset = 0 } = query;
  const optionsSearch = { owner: userId };
  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  const results = await contacts.paginate(optionsSearch, {
    limit,
    offset,
    populate: {
      path: "owner",
      select: "email",
    },
  });
  return results;
};

const getContactById = async (userId, contactId) => {
  const results = await contacts
    .findById({ contactId, owner: userId })
    .populate({
      path: "owner",
      select: "email",
    });
  return results;
};

const removeContact = async (userId, contactId) => {
  const results = await contacts.findByIdAndRemove({
    contactId,
    owner: userId,
  });
  return results;
};

const addContact = async (userId, body) => {
  const results = await contacts.create({ ...body, owner: userId });
  return results;
};

const updateContact = async (userId, contactId, body) => {
  const result = await contacts.findByIdAndUpdate(
    { contactId, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
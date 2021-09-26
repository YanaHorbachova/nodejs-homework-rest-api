const fs = require('fs/promises')
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const contactsPath = path.join(__dirname, "contacts.json");

const parsedContacts = async () => {
  const contactsList = await fs.readFile(contactsPath, "utf8", (err) => {
    if (err) throw err;
  });
  return JSON.parse(contactsList);
};

const listContacts = async () => {
  return parsedContacts();
}

const getContactById = async (contactId) => {
  const contacts = await parsedContacts();
  console.log(contacts);
  const contact = contacts.find(({ id }) => id === contactId);
  return contact;
}

const removeContact = async (contactId) => {
  const contacts = await parsedContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  if (contact) {
    const delContacts = contacts.filter((item) => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(delContacts, null, 2));
  }
  return contact;
}

const addContact = async (body) => {
  const contactList = await parsedContacts();
  const newContact = {
    id: uuidv4(),
    ...body,
  };
  contactList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contactList = await parsedContacts();
  const contact = contactList.find(({ id }) => id === contactId);
  Object.assign(contact, body);
  await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));

  return contact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

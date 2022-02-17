const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs/promises");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(contacts);
  } catch (error) {
    console.error(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = await listContacts();
    const foundContact = data.find((contact) => {
      const stringId = String(contact.id);
      return stringId === String(contactId);
    });
    if (foundContact) {
      return foundContact;
    } else {
      console.table("Contact didn`t found");
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await listContacts();
    const existedID = data.find(({ id }) => id === contactId);
    if (!existedID) console.log("no contact");
    else {
      const filteredContacts = data.filter(({ id }) => id !== contactId);
      await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
      console.table("Contact removed");
      return filteredContacts;
    }
  } catch (error) {
    console.error(error);
  }
}

async function addContact(name, email, phone) {
  const newContact = {
    id: randomUUID(),
    name,
    email,
    phone,
  };
  const data = await listContacts();
  if (newContact.name === undefined || newContact.email === undefined || newContact.phone === undefined) {
    console.table("please enter all key details");
    return data;
  }
  try {
    const newData = [...data, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newData));
    console.table(`${newContact.name}, ${newContact.email}, ${newContact.phone} - added`);
    return newData;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

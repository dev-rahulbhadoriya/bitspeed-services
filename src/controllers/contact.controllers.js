import { Op } from 'sequelize';
import Contact from '../model/contact.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if ((email === undefined || email === '') && (phoneNumber === undefined || phoneNumber === '')) {
    return res.status(400).json(new ApiError('Email or phoneNumber is required'));
  }

  try {
    // Find contact by email
    const existingContactByEmail = email ? await Contact.findOne({
      where: { email }
    }) : null;

    // Find contact by phoneNumber
    const existingContactByPhoneNumber = phoneNumber ? await Contact.findOne({
      where: { phoneNumber }
    }) : null;

    if (existingContactByEmail && existingContactByPhoneNumber) {
      // Case when both email and phone number exist
      if (existingContactByPhoneNumber.id !== existingContactByEmail.id) {
        existingContactByPhoneNumber.linkPrecedence = 'secondary';
        existingContactByPhoneNumber.linkedId = existingContactByEmail.id;
        await existingContactByPhoneNumber.save();
      }

      const secondaryContacts = await Contact.findAll({
        where: {
          [Op.or]: [
            { email },
            { phoneNumber }
          ],
        }
      });

      let primaryContactId = '';
      const secondaryIds = [];
      const existingEmails = [];
      const phoneNumberIds = [];

      secondaryContacts.forEach(({ dataValues: contact }) => {
        if (contact.linkPrecedence === 'primary') {
          primaryContactId = contact.id;
        } else if (contact.linkPrecedence === 'secondary') {
          secondaryIds.push(contact.id);
        }
        if (!existingEmails.includes(contact.email) && contact.email) {
          existingEmails.push(contact.email);
        }
        if (!phoneNumberIds.includes(contact.phoneNumber) && contact.phoneNumber) {
          phoneNumberIds.push(contact.phoneNumber);
        }
      });

      const response = {
        contact: {
          primaryContactId,
          emails: existingEmails,
          phoneNumbers: phoneNumberIds,
          secondaryContactIds: secondaryIds
        }
      };
      return res.status(200).json(new ApiResponse(201, response));
    }

    if (existingContactByPhoneNumber && !existingContactByEmail) {
      // Case when only phone number exists
      if (email) {
        const newPrimaryContact = await Contact.create({
          email,
          phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: existingContactByPhoneNumber.id
        });

        const secondaryContacts = await Contact.findAll({
          where: {
            [Op.or]: [
              { email },
              { phoneNumber }
            ]
          }
        });

        let primaryContactId = '';
        const secondaryIds = [];
        const existingEmails = [];
        const phoneNumberIds = [];

        secondaryContacts.forEach(({ dataValues: contact }) => {
          if (contact.linkPrecedence === 'primary') {
            primaryContactId = contact.id;
          } else if (contact.linkPrecedence === 'secondary') {
            secondaryIds.push(contact.id);
          }
          if (!existingEmails.includes(contact.email) && contact.email) {
            existingEmails.push(contact.email);
          }
          if (!phoneNumberIds.includes(contact.phoneNumber) && contact.phoneNumber) {
            phoneNumberIds.push(contact.phoneNumber);
          }
        });

        const response = {
          contact: {
            primaryContactId: primaryContactId || existingContactByPhoneNumber.id, 
            emails: existingEmails,
            phoneNumbers: phoneNumberIds,
            secondaryContactIds: secondaryIds
          }
        };

        return res.status(200).json(new ApiResponse(201, response));
      } else {
        // If no email is present, find secondary contacts based on phone number only
        const secondaryContacts = await Contact.findAll({
          where: {
            phoneNumber
          }
        });

        let primaryContactId = '';
        const secondaryIds = [];
        const existingEmails = [];
        const phoneNumberIds = [];

        secondaryContacts.forEach(({ dataValues: contact }) => {
          if (contact.linkPrecedence === 'primary') {
            primaryContactId = contact.id;
          } else if (contact.linkPrecedence === 'secondary') {
            secondaryIds.push(contact.id);
          }
          if (!existingEmails.includes(contact.email) && contact.email) {
            existingEmails.push(contact.email);
          }
          if (!phoneNumberIds.includes(contact.phoneNumber) && contact.phoneNumber) {
            phoneNumberIds.push(contact.phoneNumber);
          }
        });

        const response = {
          contact: {
            primaryContactId: primaryContactId || existingContactByPhoneNumber.id,
            emails: existingEmails,
            phoneNumbers: phoneNumberIds,
            secondaryContactIds: secondaryIds
          }
        };

        return res.status(200).json(new ApiResponse(201, response));
      }
    }


    if (existingContactByEmail && !existingContactByPhoneNumber) {
      // Case when only email exists
      if (phoneNumber) {
        const newPrimaryContact = await Contact.create({
          email,
          phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: existingContactByEmail.id
        });



        let primaryContactId = '';
        const secondaryIds = [];
        const existingEmails = [];
        const phoneNumberIds = [];

        const secondaryContacts = await Contact.findAll({
          where: {
            [Op.or]: [
              { email },
              { phoneNumber }
            ]
          }
        });

        secondaryContacts.forEach(({ dataValues: contact }) => {
          if (contact.linkPrecedence === 'primary') {
            primaryContactId = contact.id;
          } else if (contact.linkPrecedence === 'secondary') {
            secondaryIds.push(contact.id);
          }
          if (!existingEmails.includes(contact.email) && contact.email) {
            existingEmails.push(contact.email);
          }
          if (!phoneNumberIds.includes(contact.phoneNumber) && contact.phoneNumber) {
            phoneNumberIds.push(contact.phoneNumber);
          }
        });

        const response = {
          contact: {
            primaryContactId,
            emails: existingEmails,
            phoneNumbers: phoneNumberIds,
            secondaryContactIds: secondaryIds
          }
        };

        return res.status(200).json(response);
      } else {
        const secondaryContacts = await Contact.findAll({
          where: {
            email
          }
        });

        let primaryContactId = '';
        const secondaryIds = [];
        const existingEmails = [];
        const phoneNumberIds = [];

        secondaryContacts.forEach(({ dataValues: contact }) => {
          if (contact.linkPrecedence === 'primary') {
            primaryContactId = contact.id;
          } else if (contact.linkPrecedence === 'secondary') {
            secondaryIds.push(contact.id);
          }
          if (!existingEmails.includes(contact.email) && contact.email) {
            existingEmails.push(contact.email);
          }
          if (!phoneNumberIds.includes(contact.phoneNumber) && contact.phoneNumber) {
            phoneNumberIds.push(contact.phoneNumber);
          }
        });

        const response = {
          contact: {
            primaryContactId: primaryContactId || existingContactByEmail.id,
            emails: existingEmails,
            phoneNumbers: phoneNumberIds,
            secondaryContactIds: secondaryIds
          }
        };

        return res.status(200).json(new ApiResponse(201, response));
      }
    }

    // If no existing contact, create a new primary contact
    const newPrimaryContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: 'primary'
    });

    const response = {
      contact: {
        primaryContactId: newPrimaryContact.id,
        emails: newPrimaryContact.email ? [newPrimaryContact.email] : [],
        phoneNumbers: newPrimaryContact.phoneNumber ? [newPrimaryContact.phoneNumber] : [],
        secondaryContactIds: []
      }
    };

    return res.status(200).json(new ApiResponse(201, response));

  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json(new ApiError(error,'Internal Server Error'));
  }
};


export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    return res.status(200).json(new ApiResponse(201, contacts));
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    return res.status(500).json(new ApiError(error,'Internal Server Error'));
  }
};

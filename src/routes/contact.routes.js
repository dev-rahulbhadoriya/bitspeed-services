import express from "express";
import { identifyContact, getAllContacts } from '../controllers/contact.controllers.js';

const router = express.Router();

router.post('/identify', identifyContact);
router.get('/allContacts', getAllContacts);
export default router;

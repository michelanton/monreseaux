const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// POST d'un user
router.post("/signup",  multer, userCtrl.signup);
// LOG d'un user
router.post('/login', userCtrl.login);
// GET tout les user auth,
router.get('/users',  userCtrl.userAll);
// GET un user par son email
router.get('/users/:email', auth, userCtrl.userEmail);
// DELETE le user  auth,
router.delete('/users/:id', userCtrl.supUsrCtrl); 

module.exports = router;
  
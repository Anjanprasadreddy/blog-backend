const express =  require('express');
const router = express.Router();
const { getUsers, makeUserAdmin } = require('../controllers/Users.js');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');


router.get('/',authenticateToken, authorizeRoles('admin'),getUsers);

router.put('/:id/makeadmin',authenticateToken, authorizeRoles('admin'),makeUserAdmin);

module.exports = router;

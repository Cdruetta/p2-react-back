const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    updateRolUsuario
} = require('../controllers/users.controller');

const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');


router.post('/', createUsuario);
router.get('/', verifyToken, isAdmin, getUsuarios);
router.get('/:id', verifyToken, getUsuarioById);
router.put('/:id', verifyToken, isAdmin, updateUsuario);
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);
router.put('/:id/rol', verifyToken, isAdmin, updateRolUsuario);

module.exports = router;

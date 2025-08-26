const { Usuario } = require('../models');
const bcrypt = require('bcryptjs'); // Para hashear passwords

// Obtener todos los usuarios (solo admin)
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json({ status: 200, data: usuarios });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener usuario por ID (admin o propio usuario)
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        if (req.user.rol !== 'admin' && req.user.id !== usuario.id) {
            return res.status(403).json({ status: 403, message: 'Acceso denegado' });
        }

        res.json({ status: 200, data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuario', error: error.message });
    }
};

// Crear usuario con password
const createUsuario = async (req, res) => {
    const { nombre, email, edad, rol, password } = req.body;
    try {
        if (!nombre || !email || !edad || !password) {
            return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios' });
        }

        // Hashear el password antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            edad,
            rol: rol || 'cliente',
            password: hashedPassword
        });

        res.status(201).json({ status: 201, data: nuevoUsuario, message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al crear usuario', error: error.message });
    }
};

// Actualizar usuario (admin o propio usuario)
const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });

        if (req.user.rol !== 'admin' && req.user.id !== usuario.id) {
            return res.status(403).json({ status: 403, message: 'Acceso denegado' });
        }

        const { nombre, email, edad, password } = req.body;
        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;
        usuario.edad = edad || usuario.edad;

        // Actualizar password si se envía
        if (password) {
            usuario.password = await bcrypt.hash(password, 10);
        }

        await usuario.save();

        res.status(200).json({ status: 200, message: 'Usuario editado exitosamente', data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al editar usuario', error: error.message });
    }
};

// Eliminar usuario (solo admin)
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        await usuario.destroy();

        res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: error.message });
    }
};

// Actualizar rol (solo admin)
const updateRolUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        const { rol } = req.body;
        if (!rol) {
            return res.status(400).json({ status: 400, message: 'Debe especificar un rol' });
        }

        usuario.rol = rol;
        await usuario.save();

        res.status(200).json({ status: 200, message: 'Rol actualizado exitosamente', data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al actualizar rol', error: error.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    updateRolUsuario
};

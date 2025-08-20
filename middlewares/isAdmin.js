const isAdmin = (req, res, next) => {
    console.log(req.user)
    if (req.user.user.rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' })
    }
    next()
}

module.exports = isAdmin
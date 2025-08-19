const express = require('express')
const router = express.Router()
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller')
const verifyToken = require('../middlewares/verifyToken')
const isAdmin = require('../middlewares/isAdmin')

router.get('/', verifyToken, getProducts)
router.get('/:id', getProductById)
router.post('/', verifyToken, isAdmin, createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
const express = require('express');
const products = require('../../controllers/admin/products');
const catchAsync = require('../../utils/catchAsync');
const {
    isLoggedIn,
    isAdmin
} = require('../../utils/middleware');
const {
    upload
} = require('../../utils/Multer');
const router = express.Router();

router.route('/')
//  Get all Products.
.get(products.index)
//  Add mew Product.
.post(isLoggedIn, isAdmin, upload.single('image'), products.validate, catchAsync(products.addProduct))

//  Add new Product - Render.
router.get('/add', isLoggedIn, isAdmin, products.renderAddProduct);

router.route('/:id')
//  Get Product.
.get(products.renderUpdateProduct)
//  Update Product.
.put(isLoggedIn, isAdmin, upload.single('image'), products.validate, catchAsync(products.updateProduct))
//  Delete Product.
.delete(isLoggedIn, isAdmin, catchAsync(products.deleteProduct))

module.exports = router;
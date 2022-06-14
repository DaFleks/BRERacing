const Product = require('../../models/product');
const fs = require('fs');
const ExpressError = require('../../utils/ExpressError');
const {
    productSchema
} = require('../../utils/JoiSchemas');

//  GET ALL PRODUCTS - RENDER
module.exports.index = async (req, res) => {
    //  Find all products in the database and store them into an object.
    const products = await Product.find({});

    //  Render the products with the appropriate title.
    res.render('admin/product-list', {
        products,
        title: 'Admin > Product List'
    });
}

//  ADD NEW PRODUCT - RENDER
module.exports.renderAddProduct = (req, res) => {
    //  Render the 'Add New Product' Page.
    res.render('admin/add-product', {
        title: 'Admin > Add Product'
    });
}

//  ADD NEW PRODUCT
module.exports.addProduct = async (req, res) => {
    //  Create a new Product object with the form properties provided.
    //  Image is left blank as the product ID will be used in the filename which 
    //  is only provided after the instantiated product object.
    const product = new Product({
        name: req.body.name,
        image: '',
        sku: req.body.sku,
        stock: req.body.stock,
        price: parseFloat(req.body.price).toFixed(2),
        details: req.body.details,
        published: req.body.publish === 'true' ? true : false
    })

    //  Image Handling
    if (req.file) {
        //  If a file is present in the form body,
        //  make a new directory in the images/products directory
        //  using the new productID as the name
        fs.mkdirSync('./public/images/products/' + product._id);

        //  Initialize the new filename concatenating the 
        //  product ID with the multer provided filename.
        let newFilename = product._id + '__' + req.file.filename;

        //  The initial temporary path that the file was placed in.
        let oldPath = './public/images/temp/' + req.file.filename;

        //  The new path to move the file into.
        let newPath = './public/images/products/' + product._id + '/' + newFilename;

        //  The rename function is used to move from the old path to the new one.
        fs.rename(oldPath, newPath, (err) => {
            if (err) console.log(err);
        });

        //  In the product object, the image property is now set with the new filename.
        product.image = newFilename;
    }

    //  Save the product into the database.
    await product.save();

    //  Flash a success message and redirect to the product list.
    req.flash('success', 'Successfully made a new product!');
    res.redirect('/admin/products');
}

//  UPDATE PRODUCT - RENDER
module.exports.renderUpdateProduct = async (req, res) => {
    //  Use the ID provided in the params to find the product and store into an object.
    const product = await Product.findOne({
        _id: req.params.id
    });

    //  Render the Edit Product page with the product object.
    res.render('admin/edit-product', {
        product,
        title: 'Admin > Update Product'
    })
}

//  UPDATE PRODUCT
module.exports.updateProduct = async (req, res) => {
    //  Find the product using the ID param, and store into object.
    const product = await Product.findOne({
        _id: req.params.id
    })

    // Image Handling
    if (req.file) {
        //  If an image was uploaded into the form, remove the current image.
        fs.rm('./public/images/products/' + req.params.id + '/' + product.image, (err) => {
            if (err) {
                console.log(err);
            }
        });

        //  New filename concatenating the product ID with the multer provided filename.
        let newFilename = product._id + '__' + req.file.filename;

        //  The initial temporary path that the uploaded file was placed in.
        let oldPath = './public/images/temp/' + req.file.filename;

        //  The new path to move the file into.
        let newPath = './public/images/products/' + product._id + '/' + newFilename;

        //  The rename function is used to move from the old path to the new one.
        fs.rename(oldPath, newPath, (err) => {
            if (err) console.log(err);
        });

        //  In the product object, the image property is now set with the new filename.
        product.image = newFilename;
    }

    //  All properties aside from image are updated, anything unchanged is accounted for as the 
    //  form inputs had the exist data as values.
    product.name = req.body.name;
    product.sku = req.body.sku;
    product.stock = req.body.stock;
    product.price = parseFloat(req.body.price).toFixed(2);
    product.published = req.body.publish === 'true' ? true : false;
    product.isDiscounted = req.body.discountActive === 'true' ? true : false;
    product.discountAmount = req.body.discountAmount;
    product.discountedPrice = (parseFloat(req.body.price) - (parseFloat(req.body.price) * (parseFloat(req.body.discountAmount) / parseFloat(100)))).toFixed(2);
    product.details = req.body.details;

    //  Save the update into the database, flash success message, redirect to product list.
    await product.save();
    req.flash('success', 'Successfully updated product!');
    res.redirect('/admin/products');
}

//  DELETE PRODUCT
module.exports.deleteProduct = async (req, res) => {
    //  Delete any existing images.
    fs.rm('./public/images/products/' + req.params.id, {
        recursive: true
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });

    //  Delete product from database using the product ID in the params.
    await Product.deleteOne({
        _id: req.params.id
    });

    //  
    req.flash('success', 'Successfully deleted product!');
    res.redirect('/admin/products');
}

//  PRODUCT VALIDATION
module.exports.validate = (req, res, next) => {
    //  If an error exists on validation check, store inside an object.
    const {
        error
    } = productSchema.validate(req.body);

    //  If error exists, throw, else continue.
    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}
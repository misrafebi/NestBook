const { emit } = require('../../app');
const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema')
const User = require('../../models/userSchema')
const bcrypt = require('bcrypt');
const env = require('dotenv').config()
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')


const loadProducts = async (req, res) => {
    try {
        if (req.session.admin) {
            const search = req.query.search || ''
            const page = req.query.page || 1
            const limit = 4

            const productData = await Product.find({
                $or: [
                    { productName: { $regex: new RegExp('.*' + search + '.*', 'i') } },

                ],
            }).limit(limit * 1).skip((page - 1) * limit).populate('category').exec()

            const count = await Product.find({
                $or: [
                    { productName: { $regex: new RegExp('.*' + search + '.*', 'i') } },
                ],
            }).countDocuments()

            const categories = await Category.find({ isListed: true })

            if (categories) {
                res.render('admin/products', {
                    data: productData,
                    currentPage: page,
                    totalPages: page,
                    totalPages: Math.ceil(count / limit),
                    cat: categories,

                })
            }


        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error("Error loading products:", error);

        res.status(500).send("Internal Server Error");
    }
};





const listProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndUpdate(productId, { isBlocked: false });
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const unlistProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndUpdate(productId, { isBlocked: true });
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const toggleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        product.isBlocked = !product.isBlocked;
        await product.save();
        res.json({ success: true, isBlocked: product.isBlocked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

const loadAddProducts = async (req, res) => {
    try {
        const categories = await Category.find()
        res.render('admin/addProduct', { categories, errorMessage: '', successMessage: '' });

    } catch (error) {
        console.error('Error loading add product page:', error);
        res.render('admin/addProduct', { categories: [], errorMessage: 'Failed to load categories. Please try again.', successMessage: '' });

    }
}




const addProduct = async (req, res) => {
    try {
        const categories = await Category.find();

        const { name, price, offer, category, numOfPage, stock, publishDate, publisher, description, authorName } = req.body;

        const existingProduct = await Product.findOne({ productName: name.trim() });
        if (existingProduct) {
            return res.render('admin/addProduct', {
                categories,
                errorMessage: 'Product with this name already exists. Please use a different name.',
                successMessage: ''
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.render('admin/addProduct', {
                categories,
                errorMessage: 'Please upload at least one product image.',
                successMessage: ''
            });
        }

        const images = [];
        const uploadDir = path.join('public', 'uploads', 'product-images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (let file of req.files) {
            const originalImagePath = file.path;
            const resizedImagePath = path.join(uploadDir, file.filename);

            await sharp(originalImagePath)
                .resize({ width: 440, height: 440 })
                .toFile(resizedImagePath);

            images.push(file.filename);
        }

        const regularPrice = parseFloat(price);
        const productOffer = parseFloat(offer) || 0; 
        const salePrice = regularPrice - productOffer;

        const productData = {
            productName: name.trim(),
            regularPrice,
            salePrice,
            productOffer,
            category: category,
            quantity: parseInt(stock),
            numberOfPage: numOfPage ? parseInt(numOfPage) : undefined,
            publishDate,
            publisher,
            description,
            authorName,
            productImage: images,
        };

        const product = new Product(productData);
        await product.save();

        console.log('Product added successfully!');
        res.render('admin/addProduct', {
            categories,
            successMessage: 'Product added successfully!',
            errorMessage: ''
        });

    } catch (error) {
        console.error('Error adding product:', error);
        res.render('admin/addProduct', {
            categories: [],
            errorMessage: 'Failed to add product. Please try again.',
            successMessage: ''
        });
    }
};


const searchProduct = async (req, res) => {
    try {
        const query = req.query.query;

        let searchCondition = {};
        if (!isNaN(query)) {
            searchCondition = { salePrice: Number(query) };
        } else {
            searchCondition = { productName: { $regex: query, $options: 'i' } };
        }

        const products = await Product.find(searchCondition);

        res.render('admin/products', { products });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('An error occurred while searching for products.');
    }
};


const loadEditProduct = async (req, res) => {

    try {
        const id = req.query.id
        const product = await Product.findOne({ _id: id })
        const categories = await Category.find({})

        res.render('admin/editProduct', {
            product: product,
            category: categories,
        })

    } catch (error) {
        res.redirect('/admin/login');
    }
  
}


const editProduct = async(req,res)=>{
    try {
        const id = req.params.id
        const product = await Product.find({_id:id})
        const data = req.body
        const existingProduct = await Product.findOne({
            productName:data.productName,
            _id:{$ne:id}
        })

        if(existingProduct){
            return res.status(400).json({error:'Product with this name already exists. Please try with another name'})

        }
        console.log(data);

        const images =[]
        if(req.files && req.files.length >0){
            for(let i=0; i<req.files.length; i++){
                images.push(req.files[i].filename)
            }
        }

        const updateFields = {
            productName: data.productName,
            description: data.description,
            authorName: data.authorName,
            category: data.category, 
            regularPrice: data.regularPrice,
            salePrice: data.salePrice, 
            quantity: data.quantity,
            productOffer: data.offer, 
            numberOfPage: data.numOfPage, 
            stock: data.quantity, 
            publishDate: data.publishDate,
            publisher: data.publisher,
        };
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => file.filename);
            updateFields.$push = { productImage: { $each: images } }; 
        }

        await Product.findByIdAndUpdate(id,updateFields)
        res.redirect('/admin/products')
 
    } catch (error) {
        console.error(error);

        
    }
}


const deleteSingleImage = async(req,res)=>{
    try {
        const {imageNameToServer, productIdToServer} = req.body
        const product= await Product.findByIdAndUpdate(productIdToServer,{$pull:{productImage:imageNameToServer}})
        const imagePath = path.join('public','uploads','re-image','imageNameToServer')
        if(fs.existsSync(imagePath)){
            await fs.unlinkSync(imagePath)
            console.log(`Image ${imageNameToServer} deleted successfully`);
        }else{
            console.log(`Image ${imageNameToServer} not found`);
            
        }
        res.send({status:true})
        
    } catch (error) {
        res.redirect('')
    }
}


const getProductDetails = async (req, res) => {
    try {

        const { id } = req.params;
        const product = await Product.findById(id);
        res.json(product);


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user details', error: err.message });
    }
};


module.exports = {
    loadProducts,
    loadEditProduct,
    loadAddProducts,
    addProduct,
    listProduct,
    unlistProduct,
    toggleProduct,
    searchProduct,
    getProductDetails,
    editProduct,
    deleteSingleImage

}
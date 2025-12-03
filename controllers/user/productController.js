const Category = require('../../models/categorySchema')
const Product = require('../../models/productSchema')
const Review = require('../../models/reviewSchema')
const mongoose = require('mongoose')


const loadProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isBlocked: false,
            quantity: { $gt: 0 }
        });
        if (!products) {
            return res.status(404).send('Products not found');
        }
        const categories = await Category.find();
        const selectedCategory = req.query.category || ''
        res.render('user/products', {
            products,
            categories,
            message: '',
            selectedCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// const productDetails = async (req, res) => {
//     try {
//         const id = req.query.id;
//         // console.log(id);

//         const product = await Product.findOne({
//             _id: id,
//             isBlocked: false,
//             quantity: { $gt: 0 },
//         }).populate('category');

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }


//         product.productName = product.productName.toUpperCase();
//         const reviews = await Review.find({ Product: id });
//         const totalReviews = reviews.length;
//         const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//         const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;


//         let suggestedProducts = await Product.find({
//             category: product.category._id,
//             _id: { $ne: id },
//         })
//             .sort({ createdAt: -1 })
//             .limit(6);

//         const productWithWishlistStatus = product.map(product => {
//             const productId = product._id.toString();
//             return {
//                 ...product,
//                 isInWishlist: wishlistProductIds.includes(productId)
//             };
//         });

//         const categories = await Category.find();

//         res.render('user/product-details', {
//             product,
//             categories,
//             suggestedProducts,
//             totalReviews,
//             averageRating,
//             message: '',
//             wishlistProductIds
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// };


// const productDetails = async (req, res) => {
//     try {
//         const id = req.query.id;
//         // console.log(id);

//         const product = await Product.findOne({
//             _id: id,
//             isBlocked: false,
//             quantity: { $gt: 0 },
//         }).populate('category');

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         product.productName = product.productName.toUpperCase();
//         const reviews = await Review.find({ Product: id });
//         const totalReviews = reviews.length;
//         const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//         const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

//         let suggestedProducts = await Product.find({
//             category: product.category._id,
//             _id: { $ne: id },
//         })
//             .sort({ createdAt: -1 })
//             .limit(6);

//         // Get user's wishlist items if logged in
//         let wishlistProductIds = [];
//         if (req.session.userId) {
//             const wishlistItems = await Wishlist.find({ 
//                 userId: req.session.userId 
//             });
//             wishlistProductIds = wishlistItems.map(item => item.productId.toString());
//         }

//         const categories = await Category.find();

//         res.render('user/product-details', {
//             product,
//             categories,
//             suggestedProducts,
//             totalReviews,
//             averageRating,
//             message: '',
//             wishlistProductIds  // Pass wishlistProductIds to the template
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// };



const productDetails = async (req, res) => {
    try {
        const id = req.query.id;
        
        const product = await Product.findOne({
            _id: id,
            isBlocked: false,
            quantity: { $gt: 0 },
        }).populate('category');

        if (!product) {
            return res.status(404).send('Product not found');
        }

        product.productName = product.productName.toUpperCase();
        const reviews = await Review.find({ Product: id });
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

        let suggestedProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: id },
        })
            .sort({ createdAt: -1 })
            .limit(6);

        // Get user's wishlist items
        let wishlistProductIds = [];
        if (req.session.userId) {
            const wishlistItems = await Wishlist.find({ 
                userId: req.session.userId 
            });
            wishlistProductIds = wishlistItems.map(item => item.productId.toString());
        }

        console.log('Product ID:', product._id.toString());
        console.log('Wishlist IDs for user:', wishlistProductIds);
        console.log('Is product in wishlist?', wishlistProductIds.includes(product._id.toString()));

        res.render('user/product-details', {
            product,
            categories: await Category.find(),
            suggestedProducts,
            totalReviews,
            averageRating,
            message: '',
            wishlistProductIds: wishlistProductIds || []  // Ensure it's always an array
        });
    } catch (error) {
        console.error('Product details error:', error);
        res.status(500).send('Internal Server Error');
    }
};



// const productDetails = async (req, res) => {
//     try {
//         const id = req.query.id;
        
//         const product = await Product.findOne({
//             _id: id,
//             isBlocked: false,
//             quantity: { $gt: 0 },
//         }).populate('category');

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         product.productName = product.productName.toUpperCase();
//         const reviews = await Review.find({ Product: id });
//         const totalReviews = reviews.length;
//         const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//         const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

//         let suggestedProducts = await Product.find({
//             category: product.category._id,
//             _id: { $ne: id },
//         })
//             .sort({ createdAt: -1 })
//             .limit(6);

//         // FIXED: Use the same method as wishlist controller to get user
//         let wishlistProductIds = [];
//         if (req.session.userData?.email) {
//             const user = await User.findOne({ email: req.session.userData.email });
//             if (user) {
//                 // Find the wishlist for this user
//                 const wishlist = await Wishlist.findOne({ userId: user._id });
//                 if (wishlist) {
//                     // Extract all product IDs from wishlist items
//                     wishlistProductIds = wishlist.items.map(item => item.ProductId.toString());
//                 }
//             }
//         }

//         console.log('DEBUG - Product ID:', product._id.toString());
//         console.log('DEBUG - Wishlist IDs for user:', wishlistProductIds);
//         console.log('DEBUG - Is product in wishlist?', wishlistProductIds.includes(product._id.toString()));

//         res.render('user/product-details', {
//             product,
//             categories: await Category.find(),
//             suggestedProducts,
//             totalReviews,
//             averageRating,
//             message: '',
//             wishlistProductIds: wishlistProductIds || []  // Ensure it's always an array
//         });
//     } catch (error) {
//         console.error('Product details error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };
const loadReview = async (req, res) => {
    try {
        const id = req.query.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // const ObjectId = mongoose.Types.ObjectId;


        const product = await Product.findOne({
            _id: id,
            isBlocked: false,
            quantity: { $gt: 0 },
        }).populate('category');
        if (!product) {
            return res.status(404).send('Product not found');
        }


        const reviews = await Review.find({ Product: (id) })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalReviews = await Review.countDocuments({ Product: (id) });
        const hasMore = totalReviews > page * limit;

        const totalRev = reviews.length;

        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRev > 0 ? (totalRating / totalRev).toFixed(1) : 0;


        let suggestedProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: id },
        })
            .sort({ createdAt: -1 })
            .limit(6);

        // if (suggestedProducts.length === 0) {
        //     suggestedProducts = await Product.find()
        //         .sort({ createdAt: -1 })
        //         .limit(6);
        // }

        const categories = await Category.find();


        if (req.xhr) {
            return res.json({ reviews, hasMore });
        }

        res.render('user/product-review', {
            product,
            categories,
            reviews,
            suggestedProducts,
            totalReviews,
            averageRating,
            message: ""
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};



const postReview = async (req, res) => {
    try {
        const { productId, name, email, review, rating } = req.body;


        if (!productId || !name || !email || !review) {
            return res.render('user/productReview?id=${productId}`', { message: 'All field required' })
        }


        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }


        const newReview = new Review({
            Product: productId,
            name,
            email,
            review,
            rating
        });


        await newReview.save();

        res.redirect(`/user/productReview?id=${productId}`);
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    loadProducts,
    loadReview,
    productDetails,
    postReview
}
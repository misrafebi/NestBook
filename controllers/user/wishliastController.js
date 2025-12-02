const Category = require('../../models/categorySchema')
const User = require('../../models/userScehma')
const Wishlist = require('../../models/wishlistSchema')
const Product = require('../../models/productSchema')
// const Review = require('../../models/reviewModel')


const loadWishlist = async (req, res) => {
    try {
        const email = req.session.userData?.email;
        if (!email) {
            return res.render('user/login', {
                message: 'User not logged in',
                categories: await Category.find({})
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render('user/login', {
                message: 'User not found',
                categories: await Category.find({})
            });
        }

        const categories = await Category.find({});
        
        // Get wishlist with populated product details
        const wishlist = await Wishlist.findOne({ userId: user._id })
            .populate({
                path: 'items.ProductId',
                model: 'Product',
                select: 'productName image salePrice regularPrice productOffer quantity status authorName'
            });

        // Transform wishlist items to products array
        let products = [];
        if (wishlist && wishlist.items.length > 0) {
            products = wishlist.items.map(item => {
                // Check if ProductId exists and is populated
                if (!item.ProductId) {
                    return null; // Skip if product not found
                }
                
                return {
                    ...item.ProductId.toObject(),
                    wishlistItemId: item._id,
                    // Set default values for EJS template
                    avgRating: '0.0',
                    totalReviews: 0
                };
            }).filter(product => product !== null); // Remove null entries
        }

        res.render('user/wishlist', {
            categories,
            wishlist: wishlist || { items: [] },
            products: products,
            message: ''
        });
    } catch (error) {
        console.error('Error loading wishlist:', error);
        res.render('user/pageNotFound', {
            message: 'Something went wrong while loading wishlist. Please try again shortly.'
        });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const userEmail = req.session.userData?.email;

        if (!userEmail) {
            return res.status(401).json({
                success: false,
                message: 'User not logged in',
                redirect: '/user/login'
            });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let wishlist = await Wishlist.findOne({ userId: user._id });

        if (wishlist) {
            // Check if product already exists in wishlist
            const existingItem = wishlist.items.find(item => 
                item.ProductId.toString() === productId
            );

            if (existingItem) {
                return res.json({
                    success: false,
                    message: 'Product already in wishlist'
                });
            }

            // Add new item to wishlist
            wishlist.items.push({
                ProductId: productId
            });
        } else {
            // Create new wishlist
            wishlist = new Wishlist({
                userId: user._id,
                items: [{
                    ProductId: productId
                }]
            });
        }

        await wishlist.save();
        
        return res.json({
            success: true,
            message: 'Product added to wishlist successfully'
        });

    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { itemId } = req.body;
        const userEmail = req.session.userData?.email;

        if (!userEmail) {
            return res.status(401).json({
                success: false,
                message: 'User not logged in'
            });
        }
        
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        let wishlist = await Wishlist.findOne({ userId: user._id });
        
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        // Find and remove the item
        const itemIndex = wishlist.items.findIndex(item =>
            item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in Wishlist'
            });
        }

        // Remove the item
        wishlist.items.splice(itemIndex, 1);

        // If wishlist is empty, delete it
        if (wishlist.items.length === 0) {
            await Wishlist.findByIdAndDelete(wishlist._id);
        } else {
            await wishlist.save();
        }

        return res.json({
            success: true,
            message: 'Item removed from wishlist successfully'
        });
        
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Check if product is in wishlist (for showing red heart)
const checkWishlistStatus = async (req, res) => {
    try {
        const { productId } = req.params;
        const userEmail = req.session.userData?.email;

        if (!userEmail) {
            return res.json({ inWishlist: false });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.json({ inWishlist: false });
        }

        const wishlist = await Wishlist.findOne({
            userId: user._id,
            'items.ProductId': productId
        });

        return res.json({ 
            inWishlist: !!wishlist 
        });

    } catch (error) {
        console.error('Error checking wishlist status:', error);
        return res.json({ inWishlist: false });
    }
};
module.exports = {
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
}
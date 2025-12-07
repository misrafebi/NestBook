const Category = require('../../models/categorySchema')
const Cart = require('../../models/cartSchema')
const User = require('../../models/userScehma')
const Product = require('../../models/productSchema')

const loadCart = async (req, res) => {
    try {
        const email = req.session.userData?.email;
        if (!email) {
            return res.render('user/login', {
                message: 'User not logged in',
                categories: await Category.find({})
            });
        }

        const user = await User.findOne({ email }).populate('cart');
        if (!user) {
            return res.render('user/login', {
                message: 'User not found',
                categories: await Category.find({})
            });
        }

        const categories = await Category.find({});

        // Get cart with populated product details
        const cart = await Cart.findOne({ userId: user._id })
            .populate('items.ProductId');

        res.render('user/cart', {
            categories,
            cart: cart || { items: [] },
            message: ''
        });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).render('user/error', { message: 'Server error' });
    }
};




const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        console.log('Add to cart request received:', { productId, quantity });
        console.log('Session data:', req.session.userData);

        // Get email from session
        const userEmail = req.session.userData?.email;

        if (!userEmail) {
            console.log('User not logged in - redirecting');
            return res.status(401).json({
                success: false,
                message: 'User not logged in',
                redirect: '/user/login'
            });
        }

        // Find user by email to get the _id
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('User found:', user._id);

        const product = await Product.findById(productId);
        if (!product) {
            console.log('Product not found:', productId);
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('Product found:', product.productName);
        console.log('Product quantity:', product.quantity, 'Status:', product.status);

        // Check if the product is available and has sufficient stock
        if (product.status !== 'Available') {
            return res.status(400).json({
                success: false,
                message: 'Product is not available'
            });
        }

        let cart = await Cart.findOne({ userId: user._id });
        console.log('Existing cart:', cart);

        if (cart) {
            const existingItemIndex = cart.items.findIndex(item =>
                item.ProductId.toString() === productId
            );

            if (existingItemIndex > -1) {
                // Existing item in cart: check if the new total quantity is available
                const newQuantity = cart.items[existingItemIndex].quantity + quantity;
                if (newQuantity > product.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Only ${product.quantity} items available in stock`
                    });
                }
                // Update existing item
                cart.items[existingItemIndex].quantity = newQuantity;
                cart.items[existingItemIndex].totalPrice = newQuantity * product.salePrice;
                console.log('Updated existing item in cart');
            } else {
                // New item in cart: check if the quantity is available
                if (quantity > product.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Only ${product.quantity} items available in stock`
                    });
                }
                // Add new item
                cart.items.push({
                    ProductId: productId,
                    quantity: quantity,
                    price: product.salePrice,
                    totalPrice: product.salePrice * quantity,
                    status: 'Placed'
                });
                console.log('Added new item to cart');
            }
        } else {
            // New cart: check if the quantity is available
            if (quantity > product.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.quantity} items available in stock`
                });
            }
            // Create new cart
            cart = new Cart({
                userId: user._id,
                items: [{
                    ProductId: productId,
                    quantity: quantity,
                    price: product.salePrice,
                    totalPrice: product.salePrice * quantity,
                    status: 'Placed'
                }]
            });
            console.log('Created new cart');
        }

        await cart.save();
        console.log('Cart saved successfully');

        return res.json({
            success: true,
            message: 'Product added to cart successfully'
        });

    } catch (error) {
        console.error('Error in addToCart:', error.message);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};
// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;

        // Get user from session
        const userEmail = req.session.userData?.email;

        if (!userEmail) {
            return res.status(401).json({
                success: false,
                message: 'User not logged in'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find user's cart
        let cart = await Cart.findOne({ userId: user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find the item in cart
        const itemIndex = cart.items.findIndex(item =>
            item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Remove the item from the array
        cart.items.splice(itemIndex, 1);

        // If cart is empty after removal, delete the entire cart
        if (cart.items.length === 0) {
            await Cart.findByIdAndDelete(cart._id);
            return res.json({
                success: true,
                message: 'Item removed from cart. Cart is now empty.'
            });
        }

        // Save the updated cart
        await cart.save();

        return res.json({
            success: true,
            message: 'Item removed from cart successfully'
        });

    } catch (error) {
        console.error('Error in removeFromCart:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
    try {
        const { itemId, productId, quantity } = req.body;

        // Validate input
        if (!itemId || !productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        // Get user from session
        const userEmail = req.session.userData?.email;

        if (!userEmail) {
            return res.status(401).json({
                success: false,
                message: 'User not logged in'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find product to check stock and price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check product availability
        if (product.status !== 'Available') {
            return res.status(400).json({
                success: false,
                message: 'Product is not available'
            });
        }

        if (quantity > product.quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.quantity} items available in stock`
            });
        }

        // Find user's cart
        let cart = await Cart.findOne({ userId: user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find the item in cart
        const cartItem = cart.items.find(item =>
            item._id.toString() === itemId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Update quantity and total price
        cartItem.quantity = quantity;
        cartItem.totalPrice = quantity * product.salePrice;

        // Save the updated cart
        await cart.save();

        return res.json({
            success: true,
            message: 'Cart quantity updated successfully',
            updatedItem: {
                quantity: cartItem.quantity,
                totalPrice: cartItem.totalPrice,
                price: cartItem.price
            }
        });

    } catch (error) {
        console.error('Error in updateCartQuantity:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    loadCart,
    addToCart,
    removeFromCart,
    updateCartQuantity
}
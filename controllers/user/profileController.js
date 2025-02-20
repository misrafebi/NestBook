const Category = require('../../models/categorySchema')
const User = require('../../models/userScehma')
const Address = require('../../models/addressSchema')
const Product = require('../../models/productSchema')
const { use } = require('passport')


const loadProfile = async (req, res) => {
    try {

        const categories = await Category.find({});

        const userEmail = req.session.userData;
        if (!userEmail) {
            return res.redirect('/login');
        }

        const user = await User.findOne({ email: userEmail })
        if (!user) {
            return res.render('user/profile', {
                categories,
                message: 'User not found'
            });
        }

        res.render('user/profile', { categories, message: '', user })
    } catch (error) {
        console.error('Error to load contact us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the profile page. Please try again shortly.' })
    }
}

const loadEditAddress = async (req, res) => {
    try {
        const addressId = req.query.id; // Get the specific address ID from URL
        const categories = await Category.find({});
        const userEmail = req.session.userData;

        if (!userEmail) {
            return res.redirect('/user/login');
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.redirect('/user/login');
        }

        // Find the user's address document
        const addressDoc = await Address.findOne({ userId: user._id });

        if (!addressDoc) {
            return res.render('user/edit-address', {
                categories,
                message: 'No addresses found'
            });
        }

        // Find the specific address in the array
        const selectedAddress = addressDoc.address.id(addressId);

        if (!selectedAddress) {
            return res.render('user/edit-address', {
                categories,
                message: 'Address not found'
            });
        }

        res.render('user/edit-address', {
            categories,
            userAddress: selectedAddress,
            addressId: addressId ,
            message:""
        });

    } catch (error) {
        console.error('Error loading edit address:', error);
        res.render('user/pageNotFound', {
            message: 'Error loading address editor'
        });
    }
}

const editAddress = async (req, res) => {
    try { 
         
        const id = req.body.id

        const { name, mobile, houseAddress, pin, post, city, district, state } = req.body

        const userEmail = req.session.userData

        const categories = await Category.find({})

        if (!userEmail) {
            return res.redirect('/user/login')
        }

        const user = await User.findOne({ email: userEmail })
        if (!user) {
            return res.redirect('/user/login')
        }
        const existingAddress = await Address.findOne({ userId: user._id });
        
        const userAddress = existingAddress.address.id(id);

        const newAddress = {
            name,
            phone: mobile,
            houseAddress,
            pin: Number(pin),
            post,
            city,
            district,
            state
        }
        

       
        await Address.updateOne(
            { userId: user._id, "address._id": id }, // Find the document and the specific address
            { 
                $set: { 
                    "address.$.name": name,
                    "address.$.phone": mobile,
                    "address.$.houseAddress": houseAddress,
                    "address.$.pin": Number(pin),
                    "address.$.post": post,
                    "address.$.city": city,
                    "address.$.district": district,
                    "address.$.state": state
                } 
            }
        );        
        
        
        res.render('user/edit-address',{
            categories,
            message:"Address successfully edited. ",
            userAddress
        })
    } catch (error) {
        console.error('Error loading edit address:', error);
        res.render('user/pageNotFound', {
            message: 'Error edit address'
        });
    }
}

const loadAddAddress = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/add-address', { categories, message: '' })
    } catch (error) {
        console.error('Error to load contact us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the add address page. Please try again shortly.' })
    }
}

const addAddress = async (req, res) => {
    try {
        const categories = await Category.find({})

        const { name, mobile, houseAddress, pin, post, city, district, state } = req.body

        const userEmail = req.session.userData
        if (!userEmail) {
            return res.render('user/add-address', {
                categories,
                message: 'User not logged in'
            })
        }

        const user = await User.findOne({ email: userEmail })
        if (!user) {
            return res.render('user/add-address', {
                categories,
                message: 'Cannot found user'
            })
        }


        const newAddress = {
            name,
            phone: mobile,
            houseAddress,
            pin: Number(pin),
            post,
            city,
            district,
            state
        };


        // await Address.findOneAndUpdate(
        //     { userId: user._id },
        //     { $push: { address: newAddress } },
        //     { upsert: true, new: true }
        // );

        await Address.findOneAndUpdate(
            { userId: user._id },
            { $set: { address: newAddress } },
            { upsert: true, new: true }
        );

        res.render('user/add-address', { categories, message: "Address added successfully!" })
    } catch (error) {
        console.error('Error to load contact us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while adding the address. Please try again shortly.' })

    }
}

// const loadCheckOut = async (req, res) => {
//     try {
//         const categories = await Category.find({})
//         const userEmail = req.session.userData
//         if (!userEmail) {
//             return res.render('user/add-address', {
//                 categories,
//                 message: 'User not logged in'
//             })
//         }

//         const user = await User.findOne({ email: userEmail })
//         if (!user) {
//             return res.render('user/login', {
//                 categories,
//                 message: 'Cannot found user'
//             })
//         }
//         const id = req.query.id;

//         const product=await Product.findById(id)
//         let suggestedProducts = await Product.find({
//             category: product.category._id,
//             _id: { $ne: id },
//         })
//             .sort({ createdAt: -1 })
//             .limit(6);

//             const addressDoc=await Address.findOne({userId:user._id})

//             console.log('address Doc',addressDoc);
//             console.log('addresses',addressDoc.address);



//         res.render('user/checkout', { categories,product ,suggestedProducts,
//             addresses: addressDoc?.address || []
//          })
//     } catch (error) {
//         console.error('Error to load contact us', error);
//         res.render('user/pageNotFound',
//             { message: 'Something went wrong while loading the checkout page. Please try again shortly.' })
//     }
// }

const loadCheckOut = async (req, res) => {
    try {
        const categories = await Category.find({});
        const userEmail = req.session.userData;
        if (!userEmail) return res.redirect('/user/login');

        const user = await User.findOne({ email: userEmail });
        if (!user) return res.redirect('/user/login');

        const id = req.query.id;
        const product = await Product.findById(id);

        // Get address document
        const addressDoc = await Address.findOne({ userId: user._id });

        res.render('user/checkout', {
            categories,
            product,
            suggestedProducts: await Product.find({
                category: product.category._id,
                _id: { $ne: id },
            }).limit(6),
            addresses: addressDoc?.address || [] // Pass the address array directly
        });

    } catch (error) {
        console.error('Checkout error:', error);
        res.render('user/pageNotFound', { message: 'Error loading checkout' });
    }
}
const loadOrders = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/orders', { categories })
    } catch (error) {
        console.error('Error to load contact us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while posting the contact us page. Please try again shortly.' })
    }
}

module.exports = {
    loadProfile,
    loadEditAddress,
    loadAddAddress,
    loadCheckOut,
    loadOrders,
    addAddress,
    editAddress
}
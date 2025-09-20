const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema');

const loadOffer =async (req,res) =>{
    try {

        let products = await Product.find({})
        

        res.render('admin/offers',{
            products
        })
    } catch (error) {
        
    }
}




module.exports ={
    loadOffer
}


const loadProducts = (req,res) => {
    try {
        res.render('user/products')
    } catch (error) {
        
    }
}

const loadProductDetail = (req,res) =>{
    try {
        res.render('user/product-details')
    } catch (error) {
        
    }
}

const loadProductReview = (req,res) =>{
    try {
        res.render('user/product-review')
    } catch (error) {
        
    }
}

module.exports = {
    loadProducts,
    loadProductDetail,
    loadProductReview
}
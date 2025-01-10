

const loadProduct = (req,res) =>{
    try {
        res.render('admin/products')
    } catch (error) {
        
    }
}

const loadAddProduct = (req,res) =>{
    try {
        res.render('admin/addProduct')
    } catch (error) {
        
    }
}

const loadEditProduct = (req,res) =>{
    try {
        res.render('admin/editProduct')
    } catch (error) {
        
    }
}

module.exports ={
    loadProduct,
    loadAddProduct,
    loadEditProduct
}
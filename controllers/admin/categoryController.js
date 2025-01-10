const env = require('dotenv').config()

const loadCategory = (req,res) =>{
    try {
        res.render('admin/categories')
    } catch (error) {
        
    }
}

module.exports ={
    loadCategory
}
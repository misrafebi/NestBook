

const loadCart = (req,res) =>{
    try {
        res.render('user/cart')
    } catch (error) {
        
    }
}

module.exports ={
    loadCart
}
const loadOrders = (req,res) =>{
    try {
        res.render('admin/orders')
    } catch (error) {
        
    }
}

module.exports = {
    loadOrders
}
const loadOrders = (req,res) =>{
    try {
        res.render('admin/orders')
    } catch (error) {
        console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while load order page. Please try again shortly.' })
    }
}

module.exports = {
    loadOrders
}
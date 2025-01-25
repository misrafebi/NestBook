const Category = require('../../models/categorySchema')
const loadProfile = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/profile', { categories })
    } catch (error) {

    }
}

const loadEditAddress = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/edit-address', { categories })
    } catch (error) {

    }
}

const loadAddAddress = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/add-address', { categories })
    } catch (error) {

    }
}

const loadCheckOut = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/checkout', { categories })
    } catch (error) {

    }
}

const loadOrders = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/orders', { categories })
    } catch (error) {

    }
}

module.exports = {
    loadProfile,
    loadEditAddress,
    loadAddAddress,
    loadCheckOut,
    loadOrders
}
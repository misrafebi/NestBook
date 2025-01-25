
const Category = require('../../models/categorySchema')
const loadWallet = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/wallet', { categories })
    } catch (error) {

    }
}

const loadAddMoney = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/addmoney', { categories })
    } catch (error) {

    }
}

const loadWithdrawMoney = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/withdrawmoney', { categories })
    } catch (error) {

    }
}

module.exports = {
    loadWallet,
    loadAddMoney,
    loadWithdrawMoney
}
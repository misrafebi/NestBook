
const Category = require('../../models/categorySchema')
const User = require('../../models/userScehma')

const loadWallet = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/wallet', { categories,message:'' })
    } catch (error) {

    }
}

const loadAddMoney = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/addmoney', { categories,message:'' })
    } catch (error) {

    }
}

const loadWithdrawMoney = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/withdrawmoney', { categories ,message:''})
    } catch (error) {

    }
}

module.exports = {
    loadWallet,
    loadAddMoney,
    loadWithdrawMoney
}
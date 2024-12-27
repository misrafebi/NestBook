const { emit } = require('../../app');
const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema')
const User = require('../../models/userSchema')
const bcrypt = require('bcrypt');
const env = require('dotenv').config()
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const loadProducts = (req, res) => {
    if (req.session.admin) {
        res.render('admin/products')
    } else {
        res.redirect('/login');
    }
}

const loadAddProducts = async (req, res) => {

    try {
        const category = await Category.find({})
        res.render('admin/addProduct')
    } catch (error) {
        res.redirect('/admin/login');
    }
    // if (req.session.admin) {
    //     res.render('admin/addProduct')
    // } else {
    //     res.redirect('/admin/login');
    // }
}

const loadEditProduct = (req, res) => {
    if (req.session.admin) {
        res.render('admin/editProduct')
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    loadProducts,
    loadEditProduct,
    loadAddProducts,
}
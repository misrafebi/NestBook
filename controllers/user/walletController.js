

const loadWallet =(req,res)=>{
    try {
        res.render('user/wallet')
    } catch (error) {
        
    }
}

const loadAddMoney = (req,res)=>{
    try {
        res.render('user/addmoney')
    } catch (error) {
        
    }
}

const loadWithdrawMoney = (req,res) =>{
    try {
        res.render('user/withdrawmoney')
    } catch (error) {
        
    }
}

module.exports ={
    loadWallet,
    loadAddMoney,
    loadWithdrawMoney
}
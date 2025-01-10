

const loadReviews = (req,res) =>{
    try {
        res.render('admin/review')
    } catch (error) {
        
    }
}

const loadReplay = (req,res) =>{
    try {
        res.render('admin/replay')
    } catch (error) {
        
    }
}

module.exports = {
    loadReviews,
    loadReplay
}
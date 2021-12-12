const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 瀏覽全部餐廳
router.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error))
})

module.exports = router
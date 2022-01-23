const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 搜尋餐廳
router.get('/search', (req, res) => {
    const userId = req.user._id
    const keyword = req.query.keyword.toLowerCase()
    const sort = req.query.sort
    if (!keyword) {
        res.redirect("/")
        return
    }

    let sortKey = {}
    if (sort === 'A->Z') {
        sortKey = { name: 'asc' }
    } else if (sort === 'Z->A') {
        sortKey = { name: 'desc' }
    } else if (sort === '類別') {
        sortKey = { category: 'asc' }
    } else if (sort === '地區') {
        sortKey = { location: 'asc' }
    } else if (sort === '評分') {
        sortKey = { rating: 'desc' }
    }
    Restaurant.find({ userId })
        .lean()
        .sort(sortKey)
        .then(restaurant => {
            const restaurantData = restaurant.filter(item => {
                return item.name.toLowerCase().includes(keyword) || item.category.includes(keyword)
            })
            res.render('index', { restaurants: restaurantData, keyword: req.query.keyword, sort })
        })
        .catch(error => console.log(error))
})

// 新增餐廳頁面
router.get('/new', (req, res) => {
    return res.render("new")
})

// 瀏覽特定餐廳
router.get('/:restaurant_id', (req, res) => {
    const userId = req.user._id
    const restaurantId = req.params.restaurant_id
    // Restaurant.findById(restaurantId)
    Restaurant.findOne({ restaurantId, userId })
        .lean()
        .then(restaurant => res.render("show", { restaurant }))
        .catch(error => console.log(error))
})


// 新增餐廳
router.post('/', (req, res) => {
    const restaurant = new Restaurant()
    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.google_map = req.body.google_map
    restaurant.rating = req.body.rating
    restaurant.description = req.body.description
    restaurant.userId = req.user._id

    return restaurant.save()
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// 編輯餐廳頁面
router.get('/:restaurant_id/edit', (req, res) => {
    const userId = req.user._id
    const restaurantId = req.params.restaurant_id
    // Restaurant.findById(restaurantId)
    Restaurant.findOne({ restaurantId, userId })
        .lean()
        .then(restaurant => res.render("edit", { restaurant }))
        .catch(error => console.log(error))
})

// 更新餐廳
router.put('/:restaurant_id', (req, res) => {
    const userId = req.user._id
    const restaurantId = req.params.restaurant_id
    // Restaurant.findById(restaurantId)
    Restaurant.findOne({ restaurantId, userId })
        .then(restaurant => {
            restaurant.name = req.body.name
            restaurant.name_en = req.body.name_en
            restaurant.category = req.body.category
            restaurant.image = req.body.image
            restaurant.location = req.body.location
            restaurant.phone = req.body.phone
            restaurant.google_map = req.body.google_map
            restaurant.rating = req.body.rating
            restaurant.description = req.body.description
            return restaurant.save()
        })
        .then(() => res.redirect(`/restaurants/${restaurantId}`))
        .catch(error => console.log(error))
})

// 刪除特定餐廳
router.delete('/:restaurant_id', (req, res) => {
    const userId = req.user._id
    const restaurantId = req.params.restaurant_id
    // return Restaurant.findById(restaurant_id)
    return Restaurant.findOne({ restaurantId, userId })
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})



module.exports = router
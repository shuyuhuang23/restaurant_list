const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Restaurant = require('./models/restaurant')

const app = express()
const port = 30002

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost/restaurant-list', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
})

// express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))

// 瀏覽全部餐廳
app.get('/', (req, res) => {
    console.log(req.query)
    console.log(req.body)
    Restaurant.find()
        .lean()
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error))
})

// 新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
    return res.render("new")
})

// 瀏覽特定餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
    const restaurantId = req.params.restaurant_id
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurant => res.render("show", { restaurant }))
        .catch(error => console.log(error))
})



// 新增餐廳
app.post('/restaurants', (req, res) => {
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

    return restaurant.save()
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// 編輯餐廳頁面
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
    const restaurantId = req.params.restaurant_id
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurant => res.render("edit", { restaurant }))
        .catch(error => console.log(error))
})

// 更新餐廳
app.post('/restaurants/:restaurant_id/edit', (req, res) => {
    const restaurantId = req.params.restaurant_id
    Restaurant.findById(restaurantId)
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
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
    const restaurant_id = req.params.restaurant_id
    return Restaurant.findById(restaurant_id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// 搜尋餐廳
app.get('/search', (req, res) => {
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
    Restaurant.find()
        .lean()
        .sort(sortKey)
        .then(restaurant => {
            const restaurantData = restaurant.filter(item => {
                return item.name.toLowerCase().includes(keyword) || item.category.includes(keyword)
            })
            console.log('here')
            console.log(restaurantData)
            res.render('index', { restaurants: restaurantData, keyword: req.query.keyword, sort })
        })
        .catch(error => console.log(error))
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})
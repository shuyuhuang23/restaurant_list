const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Restaurant = require('./models/restaurant')
const restaurant = require('./models/restaurant')
// const restaurantList = require('./restaurant.json')

const app = express()
const port = 3000

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
    Restaurant.find()
        .lean()
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error))
})

// 瀏覽特定餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
    const restaurantId = req.params.restaurant_id
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurant => res.render("show", { restaurant }))
        .catch(error => console.log(error))
})

// 新增餐廳頁面
app.get('/restaurant/new', (req, res) => {
    return res.render("new")
})

// 新增餐廳
app.post('/restaurant', (req, res) => {
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

    return res.render("new")
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
    // const name = req.body.name
    // res.redirect("/")
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
app.post('/restaurants/:id/delete', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// 搜尋餐廳
app.get('/search', (req, res) => {
    const keyword = req.query.keyword.toLowerCase()

    if (!keyword) {
        res.redirect("/")
        return
    }
    Restaurant.find()
        .lean()
        .then(restaurant => {
            const restaurantData = restaurant.filter(item => {
                return item.name.toLowerCase().includes(keyword) || item.category.includes(keyword)
            })
            console.log('here')
            console.log(restaurantData)
            res.render('index', { restaurants: restaurantData, keyword: req.query.keyword })
        })
        .catch(error => console.log(error))
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})
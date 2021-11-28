const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

const app = express()
const port = 3000

// express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    const restaurantId = Number(req.params.restaurant_id)
    const restaurant = restaurantList.results.filter(item => item.id === restaurantId)[0]
    res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
    const keyword = req.query.keyword.toLowerCase()

    if (!keyword) {
        res.redirect("/")
    }

    const restaurants = restaurantList.results.filter(item => {
        return item.name.toLowerCase().includes(keyword) || item.category.includes(keyword)
    })
    res.render('index', { restaurants: restaurants, keyword: req.query.keyword })
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})


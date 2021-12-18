const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

const RestaurantList = require('../../restaurant.json')

db.once('open', () => {
    RestaurantList.results.forEach(item =>
        Restaurant.create({
            name: item.name,
            name_en: item.name_en,
            category: item.category,
            image: item.image,
            location: item.location,
            phone: item.phone,
            google_map: item.google_map,
            rating: item.rating,
            description: item.description
        }));
    console.log('done')
})
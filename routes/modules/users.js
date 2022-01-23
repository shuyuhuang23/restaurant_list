const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
    res.render('login')
})
// router.post('/login')

// router.get('/register')
// router.post('/register')
// router.get('/logout')

module.exports = router
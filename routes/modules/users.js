const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    User.findOne({ email })
        .then(user => {
            if (user) {
                console.log('This Email has been registered.')
                res.render('register', {
                    name,
                    email
                })
            } else {
                return User.create({
                    name,
                    email,
                    password
                })
                    .then(() => res.redirect('/'))
                    .catch(err => console.log(err))
            }
        })
})
// router.get('/logout')

module.exports = router
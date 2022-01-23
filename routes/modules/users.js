const express = require('express')
const router = express.Router()

const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!email || !password || !confirmPassword) {
        errors.push({ message: 'All required fields must be filled out.' })
    }
    if (password !== confirmPassword) {
        errors.push({ message: 'Two passwords are not the same.' })
    }
    if (errors.length) {
        return res.render('register', {
            errors,
            name,
            email
        })
    }
    User.findOne({ email })
        .then(user => {
            if (user) {
                errors.push({ message: 'This Email has been registered.' })
                return res.render('register', {
                    errors,
                    name,
                    email
                })
            }
            return User.create({
                name,
                email,
                password
            })
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))

        })
})
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You have successfully logged out.')
    res.redirect('/users/login')
})

module.exports = router
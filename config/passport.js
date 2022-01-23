const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

module.exports = app => {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    req.flash('warning_msg', 'This Email has not been registered.')
                    return done(null, false)
                    // return done(null, false, { message: 'This email has not been registered.' })
                }
                if (user.password !== password) {
                    req.flash('warning_msg', 'Incorrect Email or Password.')
                    return done(null, false)
                    // return done(null, false, { message: 'Incorrect Email or Password.' })
                }
                return done(null, user)
            })
            .catch(err => done(err, false))
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}
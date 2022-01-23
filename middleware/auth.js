module.exports = {
    authenticator: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('warning_msg', 'Login to access the webpage.')
        res.redirect('/users/login')
    }
}
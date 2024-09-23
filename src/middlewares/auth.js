export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        
        res.redirect('/api/session/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
};

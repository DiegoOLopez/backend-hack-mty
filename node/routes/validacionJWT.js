const passport = require('passport');

function validacionJWT(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.role)){
            return res.status(403).json(
                {
                    message: 'Forbidden: No tienes acceso'
                }
            );
        }
        next();
    }
}

module.exports = { validacionJWT, verificarRol };
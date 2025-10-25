const passport = require('passport');

const { localStrategy, loginLimiter } = require('./strategies/local.strategy');
const JwtStrategy = require('./strategies/jwt.strategy');

passport.use(localStrategy);
passport.use(JwtStrategy);

module.exports = passport;

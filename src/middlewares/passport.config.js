import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import AuthController from '../controllers/authController.js';
import { usersService } from '../service/index.js';
const LocalStrategy = local.Strategy;

const initializepassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        (req, username, password, done) => AuthController.register(req, username, password, done)
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        (username, password, done) => AuthController.login(username, password, done)
    ));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23liVLQvrMmFomDdSm",
        clientSecret: "8601951c22332cbc1f0f8926516e8ecc6318e665",
        callbackURL: `/api/session/githubcallback` // aca no se como conectarlo con github
    }, (accessToken, refreshToken, profile, done) => AuthController.githubCallback(accessToken, refreshToken, profile, done)));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await usersService.findUserById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializepassport;
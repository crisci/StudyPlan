const express = require('express');
const morgan = require('morgan');
const { json, download } = require('express/lib/response');
const { param, body, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');
const courseDAO = require('./courseDAO');
const userDAO = require('./userDAO');
const planDAO = require('./planDAO');


const app = express();
const port = 3001;

//passport setup
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDAO.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    userDAO.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});


//middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
}

app.use(cors(corsOptions));
app.use(session({ secret: "setup the secret", resave: false, saveUninitialized: false }))
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());


//courses API

//Not needed to be loggedIn
app.get('/api/courses', (req, res) => {
    courseDAO.getAllCourses()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
});

//user API
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(info);
        req.login(user, (err) => {
            if (err) return next(err);
            return res.json(req.user);
        });
    })(req, res, next);
});

app.delete('/api/sessions/current', (req, res) => {
    req.logOut(() => { res.end(); })
});

app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ errMessage: "Unauthenticated user!" })
    }
}
);

//plan API
app.get('/api/plans', isLoggedIn, (req, res) => {
     // TODO: if req.user.available => validation
    planDAO.getPlanByUser(req.user.id)
        .then(plan => res.json(plan))
        .catch(err => res.status(500).json(err));
})

app.post('/api/plans/addPlan', isLoggedIn, async (req, res) => {
    try {
        await Promise.all(req.body.map(course => planDAO.addCourseToPlan(req.user.id, course.codice))); //array of proms that execute the query for the single course
        await planDAO.updateStudentsCount();
        res.status(200).json(req.body);
    } catch (error) {
        res.status(200).json(({ errMessage: "Some courses are already inserted", errType: error }));
        return;
    }
});

app.delete('/api/plans/deletePlan', isLoggedIn, (req, res) => {
    // TODO: if req.user.available => validation
    planDAO.deletePlan(req.user.id).then(() => planDAO.updateStudentsCount())
        .then(() => res.status(200).json({ message: "Delete success" }))
        .catch(err => ({ errMessage: `Delete went wrong for the user ${req.user.id}`, errType: err }));
});

app.put('/api/plans/updatePlan', isLoggedIn, async (req, res) => {
    try {
        await planDAO.deletePlan(req.user.id);
        await Promise.all(req.body.map(course => planDAO.addCourseToPlan(req.user.id, course.codice)));
        await planDAO.updateStudentsCount();
        res.status(200).json(req.body);
    } catch (error) {
        res.status(200).json({ errMessage: `Plan update failed for user ${req.user.id}`, errType: error })
    }

});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})


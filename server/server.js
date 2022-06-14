const express = require('express');
const morgan = require('morgan');
const { json, download } = require('express/lib/response');
const { param, body, validationResult, check } = require('express-validator');
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

    return res.status(401).json({ error: 'Not authenticated' });
}

app.use(cors(corsOptions));
app.use(session({ secret: "setup the secret", resave: false, saveUninitialized: false }))
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

//Validation function
async function checkCode(value) {
    const codes = await courseDAO.getAllCoursesCode();
    if (codes.find(c => c === value)) {
        return true;
    }
    return false;
}

function PlanValidation() {

    return [
        body('available')
            .exists().withMessage('Plan type must be present')
            .isInt([0, 1]).withMessage("Plan type not available."),
        body('plan.*.codice')
            .exists().withMessage("Codice must be preset.")
            .isString().withMessage("Codice must be a string.")
            .isLength({ min: 7, max: 7 }).withMessage("Codice length not valid.")
            .custom(async (value) => {
                const check = await checkCode(value);
                if (!check) {
                    throw new Error('Code doenst match with any courses');
                }
                return true;
            })
        ,
        body('plan.*.tot_studenti')
            .optional({ nullable: true })
            .isInt()
            .withMessage('Tot studenti invalid value.'),
        body('plan.*.max_studenti')
            .optional({ nullable: true })
            .isInt().withMessage('Max studenti invalid value.'),
        body('plan.*.crediti')
            .exists().withMessage('Crediti must be present.')
            .isInt().withMessage('Crediti invalid value.'),
        body('plan')
            .isArray().withMessage('Plan invalid format')
            .custom((value, { req }) => {
                const max_crediti = req.body.available ? { min: 60, max: 80 } : { min: 20, max: 40 };
                const planCredits = value.map(p => p.crediti).reduce((prev, next) => prev + next, 0);
                if (planCredits > max_crediti.max || planCredits < max_crediti.min) {
                    throw new Error('Number of credit out of bound.');
                }
                return true;
            }),
        body('plan.*')
            .optional()
            .if(val => val.max_studenti != null)
            .custom((value) => {
                if (value.tot_studenti >= value.max_studenti) {
                    throw new Error('Too many students.');
                }
                return true;
            })
    ]
}


//courses API

//Not needed to be loggedIn
app.get('/api/courses', (req, res) => {
    courseDAO.getAllCourses()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
});

//user API
app.post('/api/sessions', [
    body('username')
        .isEmail().withMessage('Email not valid')
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    }
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

app.post('/api/plans/addPlan', isLoggedIn, PlanValidation(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        await Promise.all(req.body.plan.map(course => planDAO.addCourseToPlan(req.user.id, course.codice))); //array of proms that execute the query for the single course
        await userDAO.updateType(req.body.available, req.user.id);
        await courseDAO.updateStudentsCount();
        res.status(200).json({ type: req.body.available, plan: req.body.plan });
    } catch (error) {
        res.status(503).json({ errMessage: `Database error during the creation of plan for user ${req.user.id}.` });
        return;
    }
});

app.delete('/api/plans/deletePlan', isLoggedIn, (req, res) => {
    // TODO: if req.user.available => validation
    planDAO.deletePlan(req.user.id).then(() => courseDAO.updateStudentsCount()).then(() => userDAO.updateType(null, req.user.id))
        .then(() => res.status(200).json({ message: "Delete success" }))
        .catch(() => res.status(503).send({ errMessage: `Delete went wrong for the user ${req.user.id}` }));
});

app.put('/api/plans/updatePlan', isLoggedIn, PlanValidation(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        await planDAO.deletePlan(req.user.id);
        await Promise.all(req.body.plan.map(course => planDAO.addCourseToPlan(req.user.id, course.codice)));
        await userDAO.updateType(req.body.available, req.user.id);
        await courseDAO.updateStudentsCount();
        res.status(200).json(req.body);
    } catch (error) {
        res.status(503).json({ errMessage: `Plan update failed for user ${req.user.id}` })
    }

});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})


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


const app = express();
const port = 3001;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


//courses API
app.get('/api/courses', (req, res) => {
    courseDAO.getAllCourses()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
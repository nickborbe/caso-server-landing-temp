require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');

const LocalStrategy = require('passport-local').Strategy;
const session    = require('express-session');
const passport     = require('passport');

require('./config/passport');


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/the-to-do-list-api', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



app.use(session({
  secret: 'super super secret shhhhhhh',
  resave: true,
  saveUninitialized: true
}));
      
app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}))
// get rid of this before deploying^




const authroutes = require('./routes/authroutes')
app.use('/api', authroutes);


const mailRoutes = require('./routes/mailchimproutes')
app.use('/api', mailRoutes);



module.exports = app;

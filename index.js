//Use Express middleware to manage incoming requests and 
//dispatch them to corresponding behaviours
const express = require('express');

//Use chalk to add colours on the console
const chalk = require('chalk');

//to access form data
let bodyParser = require('body-parser');

//The 404 middleware used when an incoming request
//hits a wrong route
const http404 = require('./middleware/route404');

//Access the path 
const path = require('path');

//Used for logging
const morgan = require("morgan");

//Add more logging
const { loggers, transports, format } = require("winston");

//Accessing MongoDB
const mongoose = require('mongoose');

//session allows to store data such as user data
let session = require('express-session');

//sessions are stored into MongoDB
let MongoStore = require('connect-mongo')(session);

//Create an application 
const app = express();

const dotenv = require('dotenv');
dotenv.config();

//used to fetch the data from forms on HTTP POST, and PUT
app.use(bodyParser.urlencoded({

    extended: true

}));

app.use(bodyParser.json());

//Use the morgan logging 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//Define the loggers for Winston
loggers.add('infoLogger', {
    level: 'info',
    transports: [new transports.File({ filename: path.join(__dirname, 'logs/info.log') })],
    format: format.printf((info) => {
        let message = `${new Date(Date.now()).toUTCString()} | ${info.level.toUpperCase()}  | ${info.message}`
        return message
    })
});

loggers.add('errorLogger', {
    level: 'error',
    transports: [new transports.File({ filename: path.join(__dirname, 'logs/error.log') })],
    format: format.printf((info) => {
        let message = `${new Date(Date.now()).toUTCString()} | ${info.level.toUpperCase()}  | ${info.message}`
        return message
    })
});

const infoLogger = loggers.get('infoLogger');

//Connecting to MongoDB (async/await approach)
const connectDb = async () => {
    await mongoose.connect('mongodb://localhost:27017/info834tp1', { useNewUrlParser: true, useUnifiedTopology: true }).then(
        () => {
            console.log(chalk.green(`Connected to database`))
            infoLogger.info("Connected to database");
        },
        error => {
            console.error(chalk.red(`Connection error: ${error.stack}`))
            process.exit(1)
        }
    )
}

connectDb().catch(error => console.error(error))

//setting session
app.use(session({

    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ url: 'mongodb://localhost:27017/auth', autoReconnect: true })

}));


//Accessing the routes for the user
const routes = require('./routes/index');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

//Acces the routes 
app.use('/api/v1/', routes);
app.use('/api/v1/', userRoutes);
app.use('/api/v1/', authRoutes);

//When there is no route that caught the incoming request
//use the 404 middleware
app.use(http404.notFound);

//Listen on the port 3000
app.listen(3000, () => {
    //Add info to the loggers
    infoLogger.info('Server is running on port: 3000');

});

//Print out where the server is
console.log(chalk.green("Server is running on port: 3000"));
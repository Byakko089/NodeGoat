"use strict";

var express = require("express");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var validator  = require('express-validator');
var session = require("express-session");
var csrf = require('csurf');
var consolidate = require("consolidate"); // Templating library adapter for Express
const swig = require("swig");
var helmet = require("helmet");
var MongoClient = require("mongodb").MongoClient; // Driver for connecting to MongoDB
var http = require("http");
var marked = require("marked");
var nosniff = require('dont-sniff-mimetype');
var app = express(); // Web framework to handle routing requests
var routes = require("./app/routes");
var config = require("./config/config"); // Application config properties

/*const { port, db, cookieSecret } = require("./config/config"); // Application config properties
/*
// Fix A6 - Part 1
// Load keys for establishing secure HTTPS connection
// Se cambian en el siguiente codigo la funcion const por var para que no genere error TypeError y devuelva informacion
// Se crea un certificado ssll .pem y se cambia la ruta en key y cert
*/

var fs = require("fs");
var https = require("https");
var path = require("path");
/*const { config } = require("process");*/
var httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/key.pem")),
    cert: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/key-cert.pem"))
};


MongoClient.connect(db, function(err, db) {
    if (err) {
        console.log("Error: DB: connect");
        console.log(err);
        
        process.exit(1);
    }
    console.log("Connected to the database: " + config.db);

    /*
    // Fix for A5 - Security MisConfig
    // TODO: Review the rest of helmet options, like "xssFilter"
    // Remove default x-powered-by response header*/
    app.disable("x-powered-by");

    // Prevent opening page in frame or iframe to protect from clickjacking
    app.use(helmet.frameguard()); //xframe deprecated

    // Prevents browser from caching and storing page
    app.use(helmet.noCache());

    // Allow loading resources only from white-listed domains
    app.use(helmet.contentSecurityPolicy()); //csp deprecated

    // Allow communication only on HTTPS
    app.use(helmet.hsts());

    // TODO: Add another vuln: https://github.com/helmetjs/helmet/issues/26
    // Enable XSS filter in IE (On by default)
    // app.use(helmet.iexss());
    // Now it should be used in hit way, but the README alerts that could be
    // dangerous, like specified in the issue.
    // app.use(helmet.xssFilter({ setOnOldIE: true }));

    // Forces browser to only use the Content-Type set in the response header instead of sniffing or guessing it
    app.use(nosniff());
    

    // Adding/ remove HTTP Headers for security
    app.use(favicon(__dirname + "/app/assets/favicon.ico"));

    // Express middleware to populate "req.body" so we can access POST variables
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        // Mandatory in Express v4
        extended: false
    }));

    app.use(validator());
    app.use(function(req, res, next) {
        for (var item in req.body) {
            req.sanitize(item).escape();
        }
        next();
    });

    // Enable session management using express middleware
    app.use(session({
        // genid: (req) => {
        //    return genuuid() // use UUIDs for session IDs
        //},
        secret: config.cookieSecret,
        // Both mandatory in Express v4
        saveUninitialized: true,
        resave: true,
        /*
        // Fix for A5 - Security MisConfig
        // Use generic cookie name*/
        key: "sessionId",
        

        /*
        // Fix for A3 - XSS
        // TODO: Add "maxAge"*/
        cookie: {
            httpOnly: false,
            /* Remember to start an HTTPS server to get this working*/
            secure: true
        }
        

    }));

    /*
    // Fix for A8 - CSRF
    // Enable Express csrf protection*/
    app.use(csrf());
    // Make csrf token available in templates
    app.use(function(req, res, next) {
        res.locals.csrftoken = req.csrfToken();
        next();
    });
    
    // Register templating engine
    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", __dirname + "/app/views");
    app.use(express.static(__dirname + "/app/assets"));


    // Initializing marked library
    // Fix for A9 - Insecure Dependencies
    marked.setOptions({
        sanitize: true
    });
    app.locals.marked = marked;

    // Application routes
    routes(app, db);

    // Template system setup
    swig.setDefaults({
        // Autoescape disabled
        //autoescape: false
        /*
        // Fix for A3 - XSS, enable auto escaping*/
        autoescape: true // default value
    
    });
    /*- Fix A6 - Part 2
    // Se cambia la conexion Insegura parametrizada a continuacion y se establece la nueva conexion por HTTPS
    
    http.createServer(app).listen(port, () => {
        console.log(`Express http server listening on port ${port}`);
    });
    
    */
    
    // Se parametriza la configuracion Segura mediante HTTPS //

    https.createServer(httpsOptions, app).listen(config.port,  function() {
        console.log("Express https server listening on port " + config.port);
    });
    

});
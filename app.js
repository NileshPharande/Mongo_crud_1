try
{
    var express = require("express");
    var bodyParser = require("body-parser");
    var session = require("express-session");
    var hbars = require("express-handlebars");
    var chalk = require("chalk");
    var db = require('./models/db.js');  //Must require before routes/routes.js
    var routes = require('./routes/routes.js');
    var app = express();
    var port = process.env.PORT || 3000;

    //app.use(express.static(__dirname + "/public"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(session({secret: "Its my style", resave: true, saveUninitialized: false}));
    app.set('view engine', 'handlebars');
    app.engine('handlebars', hbars({}));

    app.get('/', routes.loginPageHandler);
    app.post('/auth', routes.authHandler);
    app.get('/registrationForm', routes.registrationFormHandler);
    app.post('/register', routes.registerFormHandler);
    app.get('/logout', routes.logoutHandler);
    app.get('/console', routes.consoleHandler);
    app.get('/edit', routes.editPageHandler);
    app.get('/saveChanges', routes.saveChangeHandler);





    app.use("*", function(req, res)
    {
        res.status(404);
        res.render("message.handlebars",{ message: '<blockquote class="mainLines"><code> The page you are looking for is not available or may have been moved.</code> </blockquote>'});
    });

    app.use(function(error, req, res, next)
    {
        console.log(chalk.red('Error: 500::', + error));
    });

    app.listen(port, function()
    {
        console.log("Server is listening on port: ", port);
    });
}
catch(err)
{
    console.log("ERROR:- App.js terminated abnormally - ", err);
}
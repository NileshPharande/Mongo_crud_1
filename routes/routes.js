try
{
    var mongoose = require('mongoose');
    var chalk = require("chalk");
    var UserModel = mongoose.model('UserModel');
    var TechModel = mongoose.model('TechModel');

    exports.loginPageHandler = function forLogin(req, res)
    {
        res.render('login.handlebars', {LoginStatus: req.session.AuthStatus});
    };

    exports.authHandler = function forAuth(req, res)
    {
        var nmReq = req.body.mn;
        var pwdReq = req.body.pwd;
        var authResult = null;

        UserModel.findOne({userName: nmReq}, function dbQuery(err, userObj)
        {
            if(err)
            {
                console.log("ERROR: Failed to get user from DB - ", err);
                authResult = '<span class="label label-danger">Login Failed: Failed to get user from DB.</span>';
                res.render('message.handlebars', {message: authResult, LoginStatus: req.session.authStatus});
            }
            if(!userObj)
            {
                console.log("Login Failed: userName dose not exists in DB.");
                authResult = '<span class="label label-danger">Login Failed: userName dose not exists in DB.</span>';
                res.render('message.handlebars', {message: authResult, LoginStatus: req.session.authStatus});
            }
            else if (pwdReq === userObj.password)
            {
                console.log("Login Successful.");
                authResult = '<span class="label label-success">Login Succesful.</span>';
                req.session.authStatus = true;
                res.render('message.handlebars', {message: authResult, LoginStatus: req.session.authStatus});
            }
            else
            {
                console.log("Login Failed: Password dose not match.");
                authResult = '<span class="label label-danger">Login Failed: Password did not match.</span>';
                res.render('message.handlebars', {message: authResult, LoginStatus: req.session.authStatus});
            }
        });
    };

    exports.registrationFormHandler = function forRegistrationForm(req, res)
    {
        res.render('register.handlebars', {LoginStatus: req.session.AuthStatus});
    };

    exports.registerFormHandler = function forRegister(req, res)
    {
        var newUser = new UserModel();
        newUser.userName = req.body.userName;
        newUser.email = req.body.email;
        newUser.password = req.body.password;

        newUser.save(function saveNewUserHandler(err, savedUser)
        {
            if(err)
            {
                var message = "A user already exists with that userName or email";
                console.log("ERROR: " + message +" : "+ err);
                res.render("register.handlebars", {errorMessage: message, LoggedIN: req.session.authStatus});
            }
            else
            {
                req.session.newUser = savedUser.userName;
                req.session.authStatus = true;
                res.render("register.handlebars", {message: '<span class="label label-success">Registration successful</span>', LoggedIN: req.session.authStatus});
            }
        });
    };

    exports.logoutHandler = function forLogout(req, res)
    {
        req.session.destroy();
        res.render('message.handlebars', {message:'<span class="label label-success">You have logged-out successfully</span>', LoggedIN: req.session.authStatus});
    };

    exports.consoleHandler = function forConsole(req, res)
    {
        var recordArray = {};
        TechModel.find({}, function getAllTechsInfo(err, techArray)
        {
            if(!err)
            {
                recordArray = techArray;
                res.render('console.handlebars', {recordArray: recordArray, LoggedIN: req.session.authStatus});
            }
        });
    };

    exports.editPageHandler = function forEditTech(req, res)
    {
        var techToEdit = req.query.tech;
        TechModel.findOne({tech: techToEdit}, function techFinderResponse(err, techRec)
        {
            if(!err)
            {
                console.log(chalk.yellow("Gong to edit -> [" + techRec.tech + " : " + techRec.description + "]"));
                res.render('editpage.handlebars', {techRec: techRec, LoggedIN: req.session.authStatus});
            }
        });
    };

    exports.saveChangeHandler = function forSavingChanges(req, res)
    {
        var techName = req.body.techName;
        var techDescrRequest = req.body.techDescr;
        var message = "";
        TechModel.update(
            {tech: techName},
            {$set: {description: techDescrRequest}},
            {multi: false},
            function(err, updatedRecord)
            {
                if(err)
                {
                    console.log("Update Failed.");
                    res.render('message.handlebars', message: '<span class="label label-danger">Update Failed</span>';, LoggedIN: req.session.authStatus);
                }
                else
                {
                    console.log(chalk.green("A record saved succesfully."));
                    res.render('message.handlebars', {message: '<span class="label label-success">A record saved succesfully</span>', LoggedIN: req.session.authStatus});
                }
            }
        );
    };




}
catch(err)
{
    console.log('ERROR: routes.js trerminated abnormally.');
}
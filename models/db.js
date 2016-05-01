try
{
    var chalk = require("chalk");
    var mongoose = require("mongoose");

    var dbURI = 'mongodb://127.0.0.1/techInfo';
//    var dbURI = 'mongodb://<dbuser>:<dbpassword>@ds019268.mlab.com:19268/nilesh_mongo';
    
    mongoose.connect(dbURI);
    mongoose.connection.on('connected', function onConnection()
    {
        console.log(chalk.green('Mongoose connected to ' + dbURI));
    });

    mongoose.connection.on('error', function onError(err)
    {
        console.log(chalk.red('Mongoose connection error: ' + err));
    });

    mongoose.connection.on('disconnected', function onDisconnect()
    {
        console.log(chalk.red('Mongoose disconnected.'));
    });

    var userSchema = new mongoose.Schema(
    {
        userName: {type: String, unique: true},
        email: {type:String, unique: true},
        password: String
    }, {collection: 'UserUnsafePassword'});

    var techSchema = new mongoose.Schema(
    {
        tech: {type: String, unique: true},
        description: {type: String}
    }, {collection: 'Tech'});

    mongoose.model('UserModel', userSchema);
    mongoose.model('TechModel', techSchema);
}
catch(err)
{
    console.log("ERROR:- db.js terminated abnormally.");
}
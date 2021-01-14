var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var app = express();
var path = require('path');
const bodyParser = require('body-parser');
const { join } = require('path');
const nodemailer=require('nodemailer');


app.use(express.static(path.join(__dirname, 'pages')));
var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// This responds with "Hello World" on the homepage
// app.get('/', function (req, res) {
//    console.log("Got a GET request for the homepage");
//    res.send('Hello GET');
// })

// This responds a POST request for the homepage
// app.post('/', function (req, res) {
//    console.log("Got a POST request for the homepage");
//    res.send('Hello POST');
// })
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'auth'
});


// This responds a DELETE request for the /del_user page.
// app.delete('/del_user', function (req, res) {
//    console.log("Got a DELETE request for /del_user");
//    res.send('Hello DELETE');
// })

app.use(express.static('pages'));
// This responds a GET request for the /list_user page.
app.get('/signin', function (req, res) {
   //console.log("Got a GET request for /list_user");
   res.sendFile(__dirname + "/pages/" + "index.html");

})

app.get('/web', function (req, res) {
    //console.log("Got a GET request for /list_user");
    
    res.sendFile(__dirname + "/pages/web/" + "index.html");
    
})

app.get('/home', function (req, res) {
    //console.log("Got a GET request for /list_user");
    
    res.sendFile(__dirname + "/pages/admin/" + "Dashboard.html",{
        name:req.session.username,
            user_id:req.session.user_id
        
    }
    );
})
app.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.pass;
    if (username && password) {
// check if user exists
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.user_id = results[0].user_id;
                request.session.username = results[0].username;
                // response.send(results[0].username);
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }           
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});
app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

app.post('/change-pass', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
// check if user exists
        connection.query('UPDATE users SET password= ? where username = ?', [password,username], function(error, results, fields) {
            if (error) throw error;
            response.send('User updated in database with pass: ' + request.body.password);
        }
    )
    }
});
   var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
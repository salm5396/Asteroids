var path = require('path');
var url = require('url');
var express = require('express');
var sqlite3 = require('sqlite3');
var app = express();
var port = 8004;
var db_filename = path.join(__dirname, 'db', 'userdata.sqlite3');
var public_dir = path.join(__dirname, 'public');

var db = new sqlite3.Database(db_filename, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

app.use(express.static(public_dir));
//app.use(bodyParser.json());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
var session = require('express-session');
app.use(session({
	secret:'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.post('/login',(req,res)=>{
	var name = req.body.uname;
	var pw = req.body.pass;
	console.log(name + " " + pw);
	db.get('SELECT password FROM data WHERE username = ?',[name], (err, rows) =>{
		if(err){
			console.log(err);
			res.end();
	 	}
		else{
			console.log(rows);
			console.log(pw + " " + rows.password);
			if(pw.localeCompare(rows.password) == 0){
			   console.log("Passwords are equal");
				req.session.name = name;
				console.log(req.session.name);
				req.session.save();
			}
			else{
				console.log("Not Equal");
			}
		}
	});
	res.sendFile(__dirname + "/public/game.html");
});


app.post('/highscore',(req,res)=>{
	console.log(req.session.name);
	console.log(req.body.score);
});


//MD5 when register
app.post('/register',(req,res)=>{
	var name;
	var pass;
	var highscore = 0;


	name = JSON.stringify(fields.uname[0]);
	pass = JSON.stringify(fields.pwd[0]);
            		var exists = false;
       			db.get("SELECT username FROM data WHERE username = ?",[name],(err,row)=>{
				if(!err){
                        		console.log("No User");
                        		db.run("INSERT INTO data(username,password,highscore) VALUES(?,?,?)",[name,pass,0],(err,row)=>{
                                		if(err){
                                        		console.log(err);
                                		}
                                		else{
                                        		console.log("added to database");
                                		}
                        		});

                		}
                		else{
                        		console.log("User exists");
                        		exists = true;
                		}
       			});
        		if(exists===true){
                		console.log("Username already exists");
        		}
});

var server = app.listen(port);



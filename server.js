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


app.get('/login',(req,res)=>{
	var req_url = url.parse(req.url,true);
	urlData = req_url.query;
	console.log(req_url);
	var name = urlData.uname;
	var pass = urlData.pwd;
	console.log(name);
	console.log(pass);
	db.get('SELECT password FROM data WHERE username = ?',[name], (err, row) =>{
		if(err){
			console.log(err);
		}
		else{
			var dataStuff = row.password;
			console.log(pass + " " + dataStuff);
			if(pass.localeCompare(dataStuff) == 0){
				console.log("Passwords are equal");
			}
			else{
				console.log("Not Equal");
			}
		}
	});
    res.end(); // end the response
});


app.post('/register',(req,res)=>{
	var req_url = url.parse(req.url,true);
	urlData = req_url.query;
	console.log(urlData);
	var name= urlData.uname;
	var pass= urlData.pwd;
	var highscore = 0;
	var exists = false;
	console.log(name);
	console.log(pass);

	db.get("SELECT username FROM data WHERE username = ?",[name],(err,row)=>{
	});
	if(!exists){
		db.get("INSERT INTO data(username,password,highscore) VALUES(?,?,?)", [name,pass,highscore], (err,row)=>{
			if(err){
				console.log(err);
			}
			else{
				console.log("added to database");
			}
		});
	}
	else{
		console.log("Username already exists");
	}
	res.end(); // end the response
});


var server = app.listen(port);


var path = require('path');
var url = require('url');
var express = require('express');
var sqlite3 = require('sqlite3');
var md5 = require('md5');
var bodyParser = require('body-parser');
var session = require('express-session');

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret:'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.post('/login',(req,res)=>{
	var name = req.body.uname;
	var pw = md5(req.body.pass);
	console.log(name + " " + pw);
	db.get('SELECT password FROM data WHERE username = ?',[name], (err, rows) =>{
		if(err){
			res.sendFile(_dirname + "/public/index.html");
	 	}
		else{
			console.log(rows);
			console.log(pw + " " + rows.password);
			if(pw.localeCompare(rows.password) == 0){
			   	console.log("Passwords are equal");
				req.session.name = name;
				console.log(req.session.name);
				req.session.save();
			        res.sendFile(__dirname + "/public/game.html");
			}
			else{
				console.log("Not Equal");
			}
		}
	});
});


app.post('/highscore',(req,res)=>{
	console.log(req.session.name);
	console.log(req.body.score);
	var score = req.body.score;
	var name = req.session.name;
	var played = req.session.played;
	var sql = 'UPDATE data SET highscore = ? WHERE username = ? AND highscore < ?';
	db.run(sql,[score,name,score], (err, rows) =>{
                if(err){
                        console.log(err);
                }
                else{
			console.log("Successfully updated");
                }
        });
	db.run("UPDATE stats SET played = ?,highscore=? WHERE username = ? AND highscore < ?",[played+1,score,name,score],(err,row)=>{
		if(err){
			console.log(err);
		}
		else{
			console.log("Updated stats table");
			res.sendFile(__dirname + "/public/game.html");
		}
	});

});


//MD5 when register
app.post('/register',(req,res)=>{
	var highscore = 0;
	var name = req.body.uname;
        var pw = md5(req.body.pass);
	var pic = req.body.avatars;
	console.log(req.body.avatars); 
        var played = 0;
	console.log(name + " " + pw);
         	var exists = false;
   		db.get("SELECT username FROM data WHERE username = ?",[name],(err,row)=>{
			if(!err){
                       		console.log("No User");
				req.session.name = name;
				req.session.save();
                       		req.session.played = played;
				req.session.save();
				db.run("INSERT INTO data(username,password,highscore,picture) VALUES(?,?,?,?)",[name,pw,0,pic],(err,row)=>{
                               		if(err){
                                       		console.log(err);
                               		}
                               		else{
                                       		console.log("added to data");
						db.run("INSERT INTO stats(username,highscore,played) VALUES(?,?,?)",[name,highscore,played],(err,row)=>{
							if(err){
								console.log(err);
							}
							else{
								console.log("added to stats");
							}
						});
						res.sendFile(__dirname + "/public/game.html");
                               		}
                       		});
               		}
               		else{
                      		console.log("User exists");
				res.sendFile(__dirname + "/public/index.html");
               		}
     		});
});
app.get('/leaderboard',(req,res)=>{
	 var score = req.body.score;
         var name = req.session.name;
	 var played = req.session.played;
	db.all("SELECT * FROM stats ORDER BY highscore DESC",[],(err,rows)=>{
		var obj;
		if(err){
			console.log(err);
		}
		res.send(rows);
	});
});

app.get('/icon',(req,res)=>{
	var name = req.session.name;
	db.get("SELECT picture From data WHERE username = ?",[name],(err,row)=>{
		if(err){
			console.log(err);
		}
		res.send(row);
	});

});



var server = app.listen(port);



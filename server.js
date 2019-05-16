var path = require('path');
var url = require('url');
var express = require('express');
var sqlite3 = require('sqlite3');
var multiparty = require('multiparty');
var app = express();
var port = 8004;
var fs = require('fs');
var db_filename = path.join(__dirname, 'db', 'userdata.sqlite3');
var public_dir = path.join(__dirname, 'public');
var mime = require('mime-types');


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
	var name = JSON.stringify(urlData.uname);
	var pass = JSON.stringify(urlData.pwd);
	db.get('SELECT password FROM data WHERE username = ?',[name], (err, row) =>{
		if(err){
			console.log(err);
			res.end();
	 	}
		else{
			console.log(pass + " " + row.password);
			if(pass.localeCompare(row.password) == 0){
			   console.log("Passwords are equal");
			}
			else{
				console.log("Not Equal");
			}
		}
	});
	res.end();
});


app.post('/highscore',(req,res)=>{
	var name,highscore;
	var form = new multiparty.Form();
	 
        form.parse(req, (err,fields,files)=>{
                console.log(fields);
                if(err){
                        console.log(err);
                }
                else{
                        name = JSON.stringify(fields.uname[0]);
                        db.get("SELECT username FROM data WHERE username = ? AND username.highscore < ?",[name,highscore],(err,row)=>{
                                if(!err){
                                	console.log("Error getting user data");
				}
                                else{
                                }
                        });
                        if(exists===true){
                                console.log("Username already exists");
                        }

          res.sendFile(public_dir);

          res.end();

                }
        });

});

app.post('/register',(req,res)=>{
	var name;
	var pass;
	var highscore = 0;
	var form = new multiparty.Form();


	form.parse(req, (err,fields,files)=>{
		console.log(fields);
		if(err){
			console.log(err);
		}
		else{
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

	  res.sendFile(public_dir);
	  
          res.end();

		}
	});
});

var server = app.listen(port);



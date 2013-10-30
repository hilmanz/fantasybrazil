/**
mailer.js
these app will process all email queue and sends it (for now) using Amazon's SES
these app will be act as worker. each worker will process 1 queue at a time.
we only process 4000 email queues, after that, the worker will quit.
we utilize foreverjs to spawn it again to process another 4000 queues.
**/
/////THE MODULES/////////
var fs = require('fs');
var path = require('path');
var config = require('./config').config;
var xmlparser = require('xml2json');
var master = require('./libs/master');
var async = require('async');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport("SMTP",{
										    	host: "email-smtp.us-east-1.amazonaws.com", // hostname
										    	secureConnection: true, // use SSL
										    	port: 465, // port for secure SMTP
										    	auth: {
										        	user: "AKIAJYPEIMSEIVGQHNTA",
										        	pass: "AqkTdt3g+a6jKvD6zYNUkLDnNwjskCkBQ4Joe7tpo9tP"
										    	}
										    });
var sleep = require('sleep');
/////DECLARATIONS/////////


/////THE LOGICS///////////////
//mysql pool
var pool  = mysql.createPool({
   host     : config.database.host,
   user     : config.database.username,
   password : config.database.password,
});
var no = 0;
var dt = new Date();
var last_t = dt.getTime();
var n_sent = 0;
var total_sent = 0;
var send_limit = 9000;
console.log('start time',last_t,'sending limit : ',send_limit);
//console.log(prev_t,last_t);
//console.log(Math.round((last_t - prev_t)/1000));
runLoop();

function runLoop(){

	pool.getConnection(function(err,conn){
		async.waterfall([
			function(callback){
				conn.query("SELECT * FROM ffgame.email_queue WHERE n_status=0 LIMIT 1;"
							,[],
				function(err,rs){
					try{
						callback(err,rs[0]);
					}catch(e){
						callback(err,null);
					}
				});
			},
			function(queue,callback){
				if(queue!=null){
					console.log('processing #',queue.id,'-',queue.email);
					//set sending status
					conn.query("UPDATE ffgame.email_queue SET n_status=1 WHERE id = ?",
							[queue.id],
							function(err,rs){
								callback(err,queue);
							});
				}else{
					callback(err,queue);
				}
				
			},
			function(queue,callback){
				//sending the email
				if(queue!=null){
					var mailOptions = {
					    from: "Supersoccer Football Manager <footballmanager@supersoccer.co.id>",
					    to: queue.email,
					    subject: queue.subject,
					    generateTextFromHTML:true,
					    html: queue.html_text
					}
					transport.sendMail(mailOptions,function(error, responseStatus){
						
						var td = ((new Date()).getTime() - last_t)/1000;
						n_sent++;
						total_sent++;
						console.log('elapsed : ',td,'total sent : ',n_sent);
						if(td < 1 && n_sent > 5){
							console.log('sleep for 1s');
							//sleep 1 second
							sleep.sleep(1);
							console.log('resetting the timewatch and n_sent');
							n_sent = 0;
							last_t = (new Date()).getTime();
						}else if(td > 1 && n_sent < 5){
							console.log('reset time and counter');
							last_t = (new Date()).getTime();
							n_sent = 0;
						}else{
							//do nothing
						}
						if(!error){
							callback(null,error,queue,responseStatus);	
						}else{
							console.log('error : ',error.message);
							callback(null,null,queue,null);
						}
					});
				}else{
					callback(null,null,queue,null);
				}
				
			},
			function(errorStatus,queue,responseStatus,callback){
				console.log(responseStatus);
				if(errorStatus!=null){


					console.log('error : ',errorStatus.message);
				}
				if(queue!=null && responseStatus!=null){
					if(responseStatus.message.search('250 OK')){
						console.log('SENT !');
						conn.query("UPDATE ffgame.email_queue SET n_status=2,send_dt=NOW() WHERE id=?",
									[queue.id],function(err,rs){
							callback(err,queue);	
						});
					}else{
						console.log('Failed:',responseStatus.message);
						conn.query("UPDATE ffgame.email_queue SET n_status=3 WHERE id=?",
									[queue.id],function(err,rs){
							callback(err,queue);	
						});
					}	
				}else{
					callback(err,queue);	
				}
			}
		],
		function(err,rs){
			conn.end(function(err){
				if(rs==null || (total_sent >= send_limit)){
					if(total_sent >= send_limit){
						console.log('Sending limit reached :( ---> ',total_sent);
					}
					pool.end(function(err){
						console.log('no more data, pool closed');
						console.log('closing smtp transport');
						transport.close();
					});
				}else{
					runLoop();	
				}
			});
		});
	});
}

function processQueue(cb){
	console.log('process queue');
	cb();
}
/**
api related to officials
*/

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var xmlparser = require('xml2json');
var async = require('async');
var config = require(path.resolve('./config')).config;
var mysql = require('mysql');
var dateFormat = require('dateformat');
var redis = require('redis');
var formations = require(path.resolve('./libs/game_config')).formations;
function prepareDb(){
	var connection = mysql.createConnection({
  		host     : config.database.host,
	   	user     : config.database.username,
	   	password : config.database.password,
	});
	
	return connection;
}
/** get the list of officials **/
function official_list(game_team_id,done){
	var conn = prepareDb();
	async.waterfall([
			function(callback){
				get_master_officials(conn,function(err,officials){
					callback(err,officials);
				});
			},
			function(officials,callback){
				get_user_officials(conn,game_team_id,officials,function(err,result){
					callback(err,result);
				});
			}
		],
		function(err,result){
			conn.end(function(e){
				done(err,result);						
			});
		});
}

function hire_official(game_team_id,official_id,callback){
	var conn = prepareDb();
	conn.query("INSERT IGNORE INTO ffgame.game_team_officials\
				(game_team_id,official_id,recruit_date)\
				VALUES\
				(?,?,NOW());",[game_team_id,official_id],function (err,rs){
					conn.end(function(e){
						callback(err,rs);
					});
				});
}
function remove_official(game_team_id,official_id,callback){
	var conn = prepareDb();
	conn.query("DELETE FROM ffgame.game_team_officials WHERE game_team_id = ? AND official_id = ?",
				[game_team_id,official_id],function (err,rs){
					conn.end(function(e){
						callback(err,rs);
					});
				});
}

function get_master_officials(conn,callback){
	conn.query("SELECT * FROM ffgame.game_officials ORDER BY id LIMIT 20;",[],callback);
}
function get_user_officials(conn,game_team_id,officials,done){
	async.waterfall(
		[
			function(callback){
				conn.query("SELECT * FROM ffgame.game_team_officials WHERE game_team_id = ? LIMIT 20;",
							[game_team_id],
							function(err,rs){
								callback(err,rs);
							});
			},
			function(result,callback){
				for(var i in officials){
					for(var j in result){
						if(officials[i].id == result[j].official_id){
							officials[i].hired = true;
							break;
						}
					}
				}
				callback(null,officials);
			}
		],
		function(err,result){
			done(err,result);
		}
	);
}
exports.official_list = official_list;
exports.hire_official = hire_official;
exports.remove_official = remove_official;
/**
* the module to read match_results file.
*/
var fs = require('fs');
var path = require('path');
var async = require('async');
var xmlparser = require('xml2json');
var config = require(path.resolve('./config')).config;
var mysql = require('mysql');
var pool  = mysql.createPool({
   host     : config.database.host,
   user     : config.database.username,
   password : config.database.password,
});
var stat_maps = require(path.resolve('./libs/stats_map')).getStats();
var FILE_PREFIX = "srml-"+config.competition.id+"-"+config.competition.year+"-";

///END OF DECLARATIONS /////


//the methods /////

exports.getReports = function(game_id,done){
	var game_file = FILE_PREFIX+game_id+'-matchresults.xml';
	var filepath = path.resolve('./data/'+game_file);
	async.waterfall(
		[
			function(callback){
				fs.stat(filepath,function(err,rs){
					callback(err,filepath);
				});			
			},
			function(filepath,callback){
				fs.readFile(filepath, function(err,rs){
					callback(err,rs);
				});
			},
			function(doc,callback){
				var json = JSON.parse(xmlparser.toJson(doc.toString()));
				callback(null,json);
			},
			function(json,callback){
				onJsonData(json,function(err,rs){
					callback(null,json);
				});
			}
		],
		function(err,result){
			pool.end();
			done(err,result);
		}
	);	
}
/**
* @todo
* update the match scores.
*/
function onJsonData(data,done){
	//console.log(data.SoccerFeed.SoccerDocument.MatchData);
	async.waterfall(
		[
			function(callback){
				if(data.SoccerFeed.SoccerDocument.MatchData.MatchInfo.Period=='FullTime'){
					//console.log(data.SoccerFeed.SoccerDocument.MatchData.TeamData);
					callback(null,
							 data.SoccerFeed.SoccerDocument.uID,
							 data.SoccerFeed.SoccerDocument.MatchData.TeamData);
				}else{
					callback(null,'not finished yet');
				}
			},
			function(game_id,data,callback){
				//home stats
				//console.log(data[0].PlayerLineUp.MatchPlayer);
				console.log('Processing Home Stats');
				
				getPlayerStats(game_id,
								data[0].TeamRef,
								data[0].PlayerLineUp.MatchPlayer,
								function(err,result){
									callback(null,game_id,data);
				});
	
				//callback(null,game_id,data);
			},
			function(game_id,data,callback){
				//away stats
				console.log('Processing Away Stats');
				
				getPlayerStats(game_id,
								data[1].TeamRef,
								data[1].PlayerLineUp.MatchPlayer,
								function(err,result){
					callback(null,game_id,data);
				});
				
				//callback(null,game_id,data);
			},
			function(game_id,data,callback){
				console.log('assign points');
				getPlayerPoints(game_id,function(err,result){
					callback(null,game_id);	
				});
				
			},
			function(game_id,callback){
				calculateTeamOverallPoints(game_id,function(err){
					callback(err,game_id,data);
				})
			},
			function(game_id,data,callback){
				updateGameFixtures(game_id,data,function(err){
					callback(err,'done');
				});
				
			}
		],
		function(err,result){
			console.log('all jobs done');
			done(err,result);
		}
	);
}

/**
*	update game final fixtures
*/
function updateGameFixtures(game_id,data,done){

	console.log('update game fixtures');
	var attendance = data.SoccerFeed.SoccerDocument.MatchData.MatchInfo.Attendance;
	
	var home_score = 0;
	var away_score = 0;
	var home_id,away_id;
	var period = data.SoccerFeed.SoccerDocument.MatchData.MatchInfo.Period;
	var matchday = 1;
	for(var i in data.SoccerFeed.SoccerDocument.MatchData.TeamData){
		var team_data = data.SoccerFeed.SoccerDocument.MatchData.TeamData[i];
		if(team_data.Side=='Home'){
			home_score = team_data.Score;
			home_id = team_data.TeamRef;

		}else{
			away_score = team_data.Score;
			away_id = team_data.TeamRef;
		}
	}
	for(var i in data.SoccerFeed.SoccerDocument.Competition.Stat){
		if(data.SoccerFeed.SoccerDocument.Competition.Stat[i].Type=='matchday'){
			matchday = data.SoccerFeed.SoccerDocument.Competition.Stat[i].$t;
		}
	}

	pool.getConnection(function(err,conn){
		async.waterfall(
			[
				function(callback){
					conn.query("INSERT INTO ffgame.game_fixtures\
								(game_id,home_id,away_id,period,matchday,\
								competition_id,session_id,home_score,away_score,attendance)\
								VALUES(?,?,?,?,?,?,?,?,?,?)\
								ON DUPLICATE KEY UPDATE\
								home_score = VALUES(home_score),\
								away_score = VALUES(away_score),\
								attendance = VALUES(attendance),\
								period = VALUES(period),\
								matchday = VALUES(matchday);",
								[game_id,home_id,away_id,period,matchday,
								config.competition.id,config.competition.year,
								home_score,away_score,attendance],
								function(err,res){
									callback(null,res);
								});
				}
			],
			function(err,results){
				conn.end(function(err){
					console.log(game_id,'update fixtures completed');
				});
				done(err);		
			}
		);
		
	});
}
/**
* calculate team's overall points
*/
function calculateTeamOverallPoints(game_id,callback){
	console.log('calculate team overall points for game #',game_id);
	pool.getConnection(
		function(err,conn){
			conn.query("INSERT INTO ffgame_stats.master_match_points\
							 (game_id,team_id,overall_points,last_update)\
							 SELECT game_id,team_id,SUM(points) AS overall_points,NOW()\
							 FROM ffgame_stats.master_match_player_points\
							 WHERE game_id=?\
							 GROUP BY team_id\
							 ON DUPLICATE KEY UPDATE\
							 overall_points = VALUES(overall_points),\
							 last_update = VALUES(last_update);",
							[game_id],function(err,rs){
								conn.end(function(err){
									callback(err);
								});
							});

		}
	);
	
}
function getPlayerStats(game_id,team_id,data,callback){
	async.eachSeries(data,
		function(data,callback){
			savePlayerStats(game_id,team_id,data,function(err,rs){
				callback();	
			});
		},
		function(err){
			console.log('iterating is done');
			callback(err,data);	
		}
	);
}
function getPlayerPoints(game_id,callback){
	generatePlayerPoints(game_id,function(err,ok){
		callback(null,null);
	});
}
function generatePlayerPoints(game_id,callback){
	var points = {};

	pool.getConnection(function(err,conn){
		console.log('creating connection');
		async.waterfall(
			[
				function(callback){
					conn.query("SELECT * FROM ffgame.game_matchstats_modifier;",[],function(err,rs){
						if(err){ console.log(err.message); }
						for(var i in rs){
							points[rs[i].name] = {
								g: rs[i].g,
								d: rs[i].d,
								m: rs[i].m,
								f: rs[i].f
							}
						}
						callback(null,points);
					});
				},
				function(points,callback){
					
					//get player lineups
					conn.query("SELECT a.team_id,player_id,b.name,b.position FROM \
								 ffgame_stats.master_match_result_stats a\
								 INNER JOIN ffgame.master_player b\
								 ON a.player_id = b.uid\
								 WHERE a.game_id=?\
								 GROUP BY a.player_id;",
								[game_id],
								function(err,players){
									callback(null,points,players);
								});
					
				},
				function(points,players,callback){
					async.eachSeries(players,function(item,done){
						calculatePlayerPoints(conn,points,game_id,item,function(err){
							done();	
						});
						
					},function(err){
						callback(null,[]);	
					});
					
				}
			],
			function(err,result){
				console.log('completed');
				conn.end(function(err){
					if(!err){
						console.log('closing connection');
						callback(null,true);
					}
				});
			}
		);
		
	});
}
/**
* calculating the real-life players game points from real lineups,
* the calculation then will be used for distributing the user's player points in their current lineup
* settings
*/
function calculatePlayerPoints(conn,points,game_id,player,done){
	async.waterfall([
		function(callback){
			conn.query("SELECT stats_name,stats_value\
				 FROM ffgame_stats.master_match_result_stats\
				 WHERE game_id = ?\
				 AND player_id=?\
				 LIMIT 100;",
				 [game_id,player.player_id],
				 function(err,stats){
				 	if(err){console.log(err.message);}
				 	callback(null,game_id,player.team_id,player.player_id,stats);
				 });
		},
		function(game_id,team_id,player_id,stats,callback){
			var game_points = 0;
			for(var i in stats){
				if(typeof stat_maps[stats[i].stats_name] !== 'undefined'){
					var point_name = stat_maps[stats[i].stats_name];
					console.log(player_id,
								points[point_name],
								stats[i].stats_value,
								getPositionAlias(player.position),
								points[point_name][getPositionAlias(player.position)],
								points[point_name][getPositionAlias(player.position)] * stats[i].stats_value
								);
					game_points += (points[point_name][getPositionAlias(player.position)] * stats[i].stats_value);

				}
			}
			console.log('game points :',game_points);
			conn.query("INSERT INTO ffgame_stats.master_match_player_points\
						 (game_id,team_id,player_id,points,last_update)\
						 VALUES(?,?,?,?,NOW())\
						 ON DUPLICATE KEY UPDATE\
						 points = VALUES(points),\
						 last_update = VALUES(last_update);",
						 [game_id,team_id,player_id,game_points],
						 function(err,rs){
						 	if(err) console.log(err);
							callback(null,'ok');			 	
						 });
		}
	]
	,function(err,result){
		done(null);
	});
}
function getPositionAlias(position){
	switch(position){
		case 'Forward' : 
			return 'f';
		break;
		case 'Defender' : 
			return 'd';
		break;
		case 'Midfielder' : 
			return 'm';
		break;
		default:
			return 'g';
		break;
	}
}
/**
*save player game stats taken from opta feed
*@params game_id  opta's game_id
*@params team_id opta's team_id
*@params data the TeamData taken from XML Object.
*@params callback
*/
function savePlayerStats(game_id,team_id,data,callback){
	//make sure that the stat is not undefined.
	if(typeof data.Stat !== 'undefined'){
		pool.getConnection(function(err,conn){
			
			if(data.Status=='Start'){
				data.Stat.push({Type:'starter',$t:1});
			}else{
				data.Stat.push({Type:'sub',$t:1});
			}
			async.eachSeries(data.Stat,
			function(item,onDone){
				var q = conn.query("INSERT INTO ffgame_stats.master_match_result_stats\
							(game_id,team_id,player_id,stats_name,stats_value)\
							VALUES(?,?,?,?,?);",
							[game_id,team_id,data.PlayerRef,item.Type,item.$t],
							function(err,rs){
								//if(err) console.log(err.message);
								//console.log(this.sql);
								onDone();	
							});

			},
			function(err){
				conn.end(function(err){
					console.log('saving stats for player ',data.PlayerRef,'finished');
					callback(null,1);
				});
			});
			
		});
	}else{
		callback(null,0);
	}
}
function addGameStats(data,callback){
	callback(err,data);
}
function handleError(err){
	done(err,'<xml><error>1</error></xml>');
}
/**
//first we check for the new file available from 
	async.waterfall([
			openFile
	    ,
	    function(arg1, arg2, callback){
	    	console.log(arg1,arg2);
	        callback(null, 'three');
	    },
	    function(arg1, callback){
	        // arg1 now equals 'three'
	        console.log(arg1);
	        callback(null, 'done');
	    }
	], function (err, result) {
	   // result now equals 'done'    
	   console.log(result);
	});
**/
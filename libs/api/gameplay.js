/**
api related to gameplay
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

//get current lineup setup
function getLineup(game_team_id,callback){
	conn = prepareDb();
	async.waterfall(
		[
			function(callback){
				conn.query("SELECT a.player_id,a.position_no,\
				b.name,b.position,b.known_name \
				FROM ffgame.game_team_lineups a\
				INNER JOIN ffgame.master_player b\
				ON a.player_id = b.uid\
				WHERE a.game_team_id=? LIMIT 17",
				[game_team_id],
				function(err,rs){
						callback(err,rs);	
				});
			},
			function(result,callback){
				conn.query("SELECT formation FROM ffgame.game_team_formation\
							WHERE game_team_id = ? LIMIT 1",
				[game_team_id],
				function(err,rs){
						var formation = '4-4-2'; //default formation
						if(rs.length>0){
							formation = rs[0].formation;	
						}
						callback(err,{
								lineup:result,
								formation:formation
							});
				});
			}
		],
	function(err,result){
		conn.end(function(e){
			callback(err,result);
		});
	});
}
function setLineup(game_team_id,setup,formation,done){
	conn = prepareDb();
	var players = [];
	for(var i in setup){
		players.push(setup[i].player_id);
	}
	async.waterfall(
		[
			function(callback){

				//first, make sure that the players are actually owned by the team
				conn.query("SELECT player_id,b.position \
							FROM ffgame.game_team_players a \
							INNER JOIN ffgame.master_player b\
							ON a.player_id = b.uid\
							WHERE a.game_team_id = ? AND a.player_id IN (?) LIMIT 11",
							[game_team_id,players],
							function(err,rs){
								console.log(this.sql);
								console.log(rs);
								callback(null,rs);
							});
				
			},
			function(players,callback){
				if(players.length==11){
					//make sure that the composition is correct
					//like position 1 must be placed by goalkeeper.
					//the rest is optional
					if(position_valid(players,setup,formation)){
						//player exists
						//then remove the existing lineup
						conn.query("DELETE FROM ffgame.game_team_lineups WHERE game_team_id = ? ",
							[game_team_id],function(err,rs){
								callback(err,rs);
							});
					}else{
						callback(new Error('invalid player positions'),[]);
					}
				}else{
					callback(new Error('one or more player doesnt belong to the team'),[]);
				}
			},
			function(rs,callback){
				var sql = "INSERT INTO ffgame.game_team_lineups\
							(game_team_id,player_id,position_no)\
							VALUES\
							";
				var data = [];
				for(var i in setup){
					if(i>0){
						sql+=',';
					}
					sql+='(?,?,?)';
					data.push(game_team_id);
					data.push(setup[i].player_id);
					data.push(setup[i].no);
				}
				conn.query(sql,data,function(err,rs){
								
								callback(err,rs);
				});
			},
			function(result,callback){
				//save formation
				conn.query("INSERT INTO ffgame.game_team_formation\
							(game_team_id,formation,last_update)\
							VALUES(?,?,NOW())\
							ON DUPLICATE KEY UPDATE\
							formation = VALUES(formation),\
							last_update = VALUES(last_update)",
							[game_team_id,formation],
							function(err,rs){
								callback(err,result);
							});
			}
		],
		function(err,result){
			conn.end(function(e){
				done(err,result);	
			});
		}
	);

}
//check if the player's formation is valid
//saat ini kita cuman memastikan bahwa nomor 1 itu harus kiper.
//nomor yg lain mau penyerang semua sih gak masalah.
function position_valid(players,setup,formation){
	console.log(players);
	
	var my_formation = formations[formation];
	
	for(var i in setup){
		for(var j in players){
			if(players[j].player_id == setup[i].player_id){
				console.log(setup[i].no,' ',players[j].position,' vs ',my_formation[setup[i].no]);
				if(setup[i].no<=11){
					if(players[j].position != my_formation[setup[i].no]){
						return false;
					}
				}
				break;
			}
		}
	}
	return true;
}
//get user's players
function getPlayers(game_team_id,callback){
	conn = prepareDb();
	conn.query("SELECT b.uid,b.name,b.position, \
				b.salary,b.transfer_value,b.known_name\
				FROM ffgame.game_team_players a\
				INNER JOIN ffgame.master_player b \
				ON a.player_id = b.uid\
				WHERE game_team_id = ? ORDER BY b.name ASC \
				LIMIT 200;",
				[game_team_id],
				function(err,rs){
					conn.end(function(e){
						callback(err,rs);	
					});
				});
}

//get user's budget
function getBudget(game_team_id,callback){
	sql = "SELECT SUM(initial_budget+total) AS budget \
			FROM (SELECT budget AS initial_budget,0 AS total FROM ffgame.game_team_purse WHERE game_team_id = ?\
			UNION ALL\
			SELECT 0,SUM(amount) AS total FROM ffgame.game_team_expenditures WHERE game_team_id = ?) a;";
	conn = prepareDb();
	conn.query(sql,
				[game_team_id,game_team_id],
				function(err,rs){
					conn.end(function(e){
						callback(err,rs);	
					});
				});
}

/**
* get player master detail
*/
function getPlayerDetail(player_id,callback){
	sql = "SELECT a.uid AS player_id,a.name,a.position,\
		a.first_name,a.last_name,a.known_name,a.birth_date,\
		a.weight,a.height,a.jersey_num,a.real_position,a.real_position_side,\
		a.country,team_id AS original_team_id,\
		b.name AS original_team_name\
		FROM ffgame.master_player a\
		INNER JOIN ffgame.master_team b\
		ON a.team_id = b.uid\
		WHERE a.uid = ? LIMIT 1;";
	conn = prepareDb();
	conn.query(sql,
				[player_id],
				function(err,rs){
					conn.end(function(e){
						if(rs.length==1){
							callback(err,rs[0]);	
						}else{
							callback(err,null);
						}
					});
				});
}
/**
* get player master stats
*/
function getPlayerStats(player_id,callback){
	sql = "SELECT a.game_id,a.points,a.performance,b.matchday\
			FROM ffgame_stats.master_player_performance a\
			INNER JOIN ffgame.game_fixtures b\
			ON a.game_id = b.game_id \
			WHERE player_id = ? ORDER BY a.id ASC;";
	conn = prepareDb();
	conn.query(sql,
				[player_id],
				function(err,rs){
					conn.end(function(e){
						callback(err,rs);	
					});
				});
}
/*
* get player's team stats
*/
function getPlayerTeamStats(game_team_id,player_id,callback){
	sql = "SELECT a.game_id,a.points,a.performance,b.matchday\
			FROM ffgame_stats.game_match_player_points a\
			INNER JOIN\
			ffgame.game_fixtures b\
			ON a.game_id = b.game_id\
			WHERE a.game_team_id = ?\
			AND a.player_id = ? LIMIT 300;";
	conn = prepareDb();
	conn.query(sql,
				[game_team_id,player_id],
				function(err,rs){

					conn.end(function(e){
						callback(err,rs);	
					});
				});
}


/**
* get user's financial statement
*/
function getFinancialStatement(game_team_id,done){
	var async = require('async');
	conn = prepareDb();
	async.waterfall(
		[
			function(callback){
				//get the total matches by these team
				
				conn.query("SELECT COUNT(*) AS total_matches FROM (SELECT game_id\
							FROM ffgame.game_team_expenditures WHERE game_team_id = ?\
							GROUP BY game_id) a;",
					[game_team_id],
					function(err,result){
					if(typeof result !== 'undefined'){
						callback(err,result[0]);
					}else{
						callback(err,null);
					}
				});
			},
			function(matches,callback){
				if(matches!=null){
					conn.query("SELECT item_name,item_type,SUM(amount) AS total\
								FROM ffgame.game_team_expenditures\
								WHERE game_team_id=?\
								GROUP BY item_name;",
						[game_team_id],
						function(err,result){
							callback(err,{total_matches:matches.total_matches,
										  report:result});
					});
				}else{	
					callback(null,null);
				}
			}
		],
		function(err,result){
			conn.end(function(e){
				done(err,result);
			});
		}
	);
}
function next_match(team_id,done){
	var async = require('async');
	conn = prepareDb();
	async.waterfall(
		[
			function(callback){
				conn.query("SELECT a.id,\
						a.game_id,a.home_id,b.name AS home_name,a.away_id,\
						c.name AS away_name,a.home_score,a.away_score,\
						a.matchday,a.period,a.session_id,a.attendance,match_date\
						FROM ffgame.game_fixtures a\
						INNER JOIN ffgame.master_team b\
						ON a.home_id = b.uid\
						INNER JOIN ffgame.master_team c\
						ON a.away_id = c.uid\
						WHERE (home_id = ? OR away_id=?) AND period <> 'FullTime'\
						ORDER BY a.matchday\
						LIMIT 1;\
						",[team_id,team_id],function(err,rs){
							callback(err,rs);
						});
			}
		],
		function(err,result){
			conn.end(function(e){
				done(err,result);
			});
		}
	);
}
function getVenue(team_id,done){
	var async = require('async');
	conn = prepareDb();
	async.waterfall(
		[
			function(callback){
				conn.query("SELECT stadium_name AS name,stadium_capacity AS capacity \
								FROM ffgame.master_team WHERE uid=? LIMIT 1;",
								[team_id],function(err,rs){
							callback(err,rs[0]);
						});
			}
		],
		function(err,result){
			conn.end(function(e){
				done(err,result);
			});
		}
	);
}
function best_match(game_team_id,done){
	var async = require('async');
	conn = prepareDb();
	async.waterfall(
		[
			function(callback){
				conn.query("SELECT game_team_id,game_id,SUM(points) AS total_points \
							FROM ffgame_stats.game_match_player_points \
							WHERE game_team_id = ?\
							GROUP BY game_id ORDER BY total_points DESC LIMIT 1;\
						",[game_team_id],function(err,rs){
							if(err){
								callback(new Error('no data'),{});
							}else{
								if(typeof rs[0] !== 'undefined'){
									console.log(rs[0]);
									callback(err,rs[0]);	
								}else{
									callback(new Error('no data'),{});
								}
							}
						});
			},
			function(best_match,callback){
				conn.query("SELECT a.home_id,a.away_id,b.name AS home_name,c.name AS away_name \
							FROM ffgame.game_fixtures a\
							INNER JOIN ffgame.master_team b\
							ON a.home_id = b.uid\
							INNER JOIN ffgame.master_team c\
							ON a.away_id = c.uid\
							WHERE \
							a.game_id=?\
							LIMIT 1",
							[best_match.game_id],
							function(err,rs){
								console.log(rs[0]);
								callback(err,{match:rs[0],points:best_match.total_points});
							});
			}
		],
		function(err,result){
			conn.end(function(e){
				done(err,result);
			});
		}
	);
}
exports.best_match = best_match;
exports.getVenue = getVenue;
exports.next_match = next_match;
exports.getFinancialStatement = getFinancialStatement;
exports.getPlayerDetail = getPlayerDetail;
exports.getPlayerTeamStats = getPlayerTeamStats;
exports.getPlayerStats = getPlayerStats;
exports.getLineup = getLineup;
exports.setLineup = setLineup;
exports.getPlayers = getPlayers;
exports.getBudget = getBudget;
exports.match = require(path.resolve('./libs/api/match'));
exports.officials = require(path.resolve('./libs/api/officials'));
exports.sponsorship = require(path.resolve('./libs/api/sponsorship'));
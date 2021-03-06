/**
*Stadium Income
High = Against Top 3 Teams in EPL
Standard = Against 4 - 10 Teams in EPL
Low = Against 11 - Bottom Teams in EPL

1st Quandrant (Top 25% Teams in Leaderboard) earns max 100%
High=(Attendance_Value*100%) * 100 USD
Standard=(Attendance_Value*100%) * 75 USD
Low=(Attendance_Value*100%) * 50 USD

2nd Quandrant (Second 25% Teams in Leaderboard) earns 75%
High=(Attendance_Value*75%) * 50 USD
Standard=(Attendance_Value*80%) * 30 USD
Low=(Attendance_Value*100%) * 25 USD

3rd Quandrant (Third 25% Teams in Leaderboard) earns 50%
High=(Attendance_Value*50%) * 100 USD
Standard=(Attendance_Value*75%) * 75 USD
Low=(Attendance_Value*85%) * 50 USD

4th Quandrant (Third 25% Teams in Leaderboard) earns 25%
High=(Attendance_Value*25%) * 100 USD
Standard=(Attendance_Value*50%) * 75 USD
Low=(Attendance_Value*75%) * 50 USD

* Commercial Director = earnings  + 15%
* Marketing Manager = Earnings + 10%
* Public Relations Officer = Earnings + 5%

*/
exports.stadium_earning_category = {
	high: {from:1,to:3},
	standard: {from:4,to:10},
	low: {from:11,to:20}
}
exports.cost_modifiers = {
	operating_cost: 0.4,
}
exports.stadium_earnings = {
	q1:{
		price:{
			high: 30,
			standard: 25,
			low: 20,
		},
		ratio: {
			high:1.0,
			standard:1.0,
			low:1.0,
		},
	},
	q2:{
		price:{
			high: 30,
			standard: 25,
			low: 20,
		},
		ratio: {
			high:0.8,
			standard:0.8,
			low:0.8,
		},
	},
	q3:{
		price:{
			high: 30,
			standard: 25,
			low: 20,
		},
		ratio: {
			high:0.6,
			standard:0.6,
			low:0.6,
		},
	},
	q4:{
		price:{
			high: 30,
			standard: 25,
			low: 20,
		},
		ratio: {
			high:0.5,
			standard:0.5,
			low:0.5,
		},
	},
}
/*
<option value="4-4-2">4-4-2</option>
			<option value="4-4-1-1">4-4-1-1</option>
			<option value="4-3-3">4-3-3</option>
			<option value="4-3-2-1">4-3-2-1</option>
			<option value="4-3-1-2">4-3-1-2</option>
			<option value="5-3-2">5-3-2</option>
			<option value="5-3-1-1">5-3-1-1</option>
			<option value="5-2-2-1">5-2-2-1</option>
			<option value="4-2-4">4-2-4</option>
			<option value="3-4-3">3-4-3</option>
			<option value="3-4-2-1">3-4-2-1</option>
*/
exports.formations = {
	'4-4-2': ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Midfielder','Forward','Forward'],
	'4-4-1-1': ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Midfielder','Forward','Forward'],
	'4-4-2-A': ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Midfielder','Forward','Forward'],
	'4-3-3': ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Forward','Forward','Forward'],
	'4-2-3-1' : ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Forward/Midfielder','Midfielder','Forward/Midfielder','Forward','Forward/Midfielder'],
	'3-5-2' : ['','Goalkeeper','Defender','Defender','Midfielder','Defender','Midfielder','Midfielder','Midfielder','Midfielder','Forward','Forward'],
	'4-3-2-1': ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Forward/Midfielder','Forward/Midfielder','Forward'],
	'4-3-1-2': ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Forward/Midfielder','Forward','Forward'],
	'5-3-2': ['','Goalkeeper','Defender','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Forward','Forward'],
	'5-3-1-1': ['','Goalkeeper','Defender','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Forward/Midfielder','Forward'],
	'5-2-2-1': ['','Goalkeeper','Defender','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Forward/Midfielder','Forward/Midfielder','Forward'],
	'4-2-4': ['','Goalkeeper','Defender','Defender','Defender','Defender','Midfielder','Midfielder','Forward/Midfielder','Forward/Midfielder','Forward','Forward'],
	'3-4-3': ['','Goalkeeper','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Midfielder','Forward','Forward','Forward'],
	'3-4-2-1': ['','Goalkeeper','Defender','Defender','Defender','Midfielder','Midfielder','Midfielder','Midfielder','Forward/Midfielder','Forward/Midfielder','Forward'],
}

//initial amount of money the user will have.
exports.initial_money = 100;
exports.sponsorship_chance = 0.4;
exports.end_of_match_bonus = {
	all_lineup_played: 20,
	cash_below_zero:-100,
}
exports.player_stats_category = {
    games:[
        'game_started',
        'total_sub_on'
    ],
    passing_and_attacking:[
        'goals',
		'att_freekick_goal',
		'att_pen_goal',
		'att_ibox_target',
		'att_obox_target',
		'goal_assist_openplay',
		'goal_assist_setplay',
		'att_assist_openplay',
		'att_assist_setplay',
		'second_goal_assist',
		'big_chance_created',
		'accurate_through_ball',
		'accurate_cross_nocorner',
		'accurate_pull_back',
		'won_contest',
		'long_pass_own_to_opp_success',
		'accurate_long_balls',
		'accurate_flick_on',
		'accurate_layoffs',
		'penalty_won',
		'won_corners',
		'fk_foul_won'

    ],
    defending:[
        'duel_won',
		'aerial_won',
		'ball_recovery',
		'won_tackle',
		'interception_won',
		'interceptions_in_box',
		'offside_provoked',
		'outfielder_block',
		'effective_blocked_cross',
		'effective_head_clearance',
		'effective_clearance',
		'clearance_off_line'
    ],
    goalkeeper:[
        'good_high_claim',
        'saves'
    ],
    mistakes_and_errors:[
        'penalty_conceded',
		'fk_foul_lost',
		'poss_lost_all',
		'challenge_lost',
		'error_lead_to_shot',
		'error_lead_to_goal',
		'total_offside',
		'yellow_card',
		'red_card'
    ]
};

exports.team_stars = {
"t847":38,
"t838":48,
"t837":71,
"t832":63,
"t831":66,
"t830":50,
"t659":52,
"t632":69,
"t614":75,
"t596":59,
"t575":49,
"t537":53,
"t536":54,
"t535":59,
"t517":52,
"t497":65,
"t494":55,
"t368":69,
"t366":73,
"t360":63,
"t359":72,
"t357":71,
"t1266":63,
"t1221":57,
"t1219":55,
"t1216":52,
"t1215":49,
"t119":85,
"t118":90,
"t114":71,
"t1042":55,
"t1041":52};
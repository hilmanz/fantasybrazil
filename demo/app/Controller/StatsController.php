<?php
App::uses('AppController', 'Controller');
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('Sanitize', 'Utility');
require_once APP.DS.'Vendor'.DS.'common.php';
class StatsController extends AppController {

/**
 * Controller name
 *
 * @var string
 */
	public $name = 'Stats';
	
	public function index($type=null){
		$this->report($type);
	}
	public function report($type){
		$this->loadModel('Stats');
		$this->loadModel('BestAndWorstStats');
		$type = intval($type);
		switch($type){
			case 1:
				$response = $this->bpl_leaderboard();
			break;
			case 2:
				$response = $this->best_and_worsts_in_league();
			break;
			case 3:
				$response = $this->weekly_match_reports();
			break;
			case 4:
				$response = $this->last_week_best_and_worsts_player();
			break;
			case 5:
				$response = $this->team_stats_cummulative();
			break;
			case 6:
				$response = $this->player_stats_cummulative();
			break;
			case 7:
				$response = $this->cumulative_best_and_worsts_player();
			break;
			case 8:
				$response = $this->team_stats_per_game();
			break;
			case 10:
				$response = $this->player_stats_per_match();
			break;
			default:
				$response = array('status'=>1,'data'=>'ready');
			break;
		}
		$this->output($response['status'],$response['data']);
	}
	public function bpl_leaderboard(){
		$result = $this->Stats->getLeaderboard();
		return array('status'=>'1','data'=>$result);
	}
	public function best_and_worsts_in_league(){
		$result = $this->BestAndWorstStats->getReports();
		return array('status'=>'1','data'=>$result);
	}
	public function weekly_match_reports(){
		$this->loadModel('WeeklyMatchStats');
		$matchday = intval($this->request->query['matchday']);
		if($matchday==0){
			$matchday = 1;
		}
		$result = $this->WeeklyMatchStats->getReports($matchday);
		return array('status'=>'1','data'=>$result);
	}
	public function last_week_best_and_worsts_player(){
		$this->loadModel('PlayerStats');
		$result = $this->PlayerStats->last_week_report();
		return array('status'=>'1','data'=>$result);	
	}
	public function cumulative_best_and_worsts_player(){
		$this->loadModel('PlayerStats');
		$result = $this->PlayerStats->cumulative_reports();
		return array('status'=>'1','data'=>$result);	
	}
	public function team_stats_cummulative(){
		$this->loadModel('TeamStats');
		if(isset($this->request->query['team_id'])){
			$team_id = Sanitize::clean($this->request->query['team_id']);
			$result = $this->TeamStats->getReports($team_id);
			return array('status'=>'1','data'=>$result);	
		}else{
			return array('status'=>'0','data'=>'');
		}
		
	}
	public function team_stats_per_game(){
		$this->loadModel('TeamStats');
		if(isset($this->request->query['team_id'])){
			$team_id = Sanitize::clean($this->request->query['team_id']);
			$game_id = Sanitize::clean($this->request->query['game_id']);
			$result = $this->TeamStats->individualMatchReport($game_id,$team_id);
			return array('status'=>'1','data'=>$result);	
		}else{
			return array('status'=>'0','data'=>'');
		}
		
	}
	public function player_stats_cummulative(){
		$this->loadModel('PlayerStats');
		if(isset($this->request->query['player_id'])){
			$player_id = Sanitize::clean($this->request->query['player_id']);
			$result = $this->PlayerStats->individual_report($player_id);
			
			return array('status'=>'1','data'=>$result);	
		}else{
			return array('status'=>'0','data'=>'');
		}
	}
	public function player_stats_per_match(){
		$this->loadModel('PlayerStats');
		if(isset($this->request->query['player_id'])&&isset($this->request->query['game_id'])){
			$player_id = Sanitize::clean($this->request->query['player_id']);
			$game_id = Sanitize::clean($this->request->query['game_id']);
			$result = $this->PlayerStats->individual_report_per_match($game_id,$player_id);
			
			return array('status'=>'1','data'=>$result);	
		}else{
			return array('status'=>'0','data'=>'');
		}
	}
	private function output($status,$data){
		$this->layout='ajax';
		$this->set('response',array('status'=>$status,'data'=>$data));
		$this->render('json/index');
	}
}
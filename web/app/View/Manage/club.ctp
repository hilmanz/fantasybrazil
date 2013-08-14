<?php
//tokenized staff list
$staff_token = array();
$total_expenses = 0;
$total_expenses+= intval(@$finance['operating_cost']);
$total_expenses+= intval(@$finance['player_salaries']);
$total_expenses+= intval(@$finance['commercial_director']);
$total_expenses+= intval(@$finance['marketing_manager']);
$total_expenses+= intval(@$finance['public_relation_officer']);
$total_expenses+= intval(@$finance['head_of_security']);
$total_expenses+= intval(@$finance['football_director']);
$total_expenses+= intval(@$finance['chief_scout']);
$total_expenses+= intval(@$finance['general_scout']);
$total_expenses+= intval(@$finance['finance_director']);
$total_expenses+= intval(@$finance['tax_consultant']);
$total_expenses+= intval(@$finance['accountant']);

$starting_balance = intval(@$finance['budget']) 
                    - intval(@$finance['total_earnings']) 
                    + abs(intval(@$total_expenses));
foreach($staffs as $staff){
  $staff_token[] = str_replace(" ","_",strtolower($staff['name']));
}
function isStaffExist($staff_token,$name){ 
  foreach($staff_token as $token){
    if($token==$name){
      return true;
    }
  }
}
?>
<div id="myClubPage">
    <?php echo $this->element('infobar'); ?>
    <div class="headbar tr">
        <div class="club-info fl">
            <a class="thumb-club fl"><img src="<?=$this->Html->url('/images/team/'.str_replace(" ","_",strtolower($original['name'])).'.png')?>" /></a>
            <div class="fl club-info-entry">
                <h3 class="clubname"><?=h($club['team_name'])?></h3>
                <h3 class="datemember"><?=h(date("d-m-Y",strtotime($user['register_date'])))?></h3>
            </div>
        </div>
        <div class="club-money fr">
            <h3 class="clubrank">Rank: <?=number_format($USER_RANK)?></h3>
            <h3 class="clubmoney">SS$ <?=number_format($team_bugdet)?></h3>
        </div>
    </div><!-- end .headbar -->
    <div id="thecontent">
        <div class="content">
            <div id="clubtabs">
              <ul>
                <li><a href="#tabs-Info">Info</a></li>
                <li><a href="#tabs-Money">Keuangan</a></li>
                <li><a href="#tabs-Players">Pemain</a></li>
                <li><a href="#tabs-Staff">Staff</a></li>
              </ul>
              <div id="tabs-Info">
                <div class="avatar-big fl">
                    <img src="http://graph.facebook.com/<?=$user['fb_id']?>/picture" />
                </div>
                <div class="user-details fl">
                    <h3 class="username"><?=h($user['name'])?></h3>
                    <h3 class="useremail"><?=h($user['email'])?></h3>
                    <h3 class="usercity"><?=h($user['location'])?></h3>
                </div><!-- end .row -->
              </div><!-- end #Info -->
              <div id="tabs-Money">
                    <table cellspacing="0" cellpadding="0" width="100%">
                      <tr class="head">
                        <td colspan="5">LAST WEEK'S BALANCE</td>
                        <td align="right" class="prevbalance">SS$ <?=number_format($starting_balance)?></td>
                      </tr>
                      <tr>
                        <td>Tickets</td>
                        <td></td>
                        <td></td>
                        <td>Matches</td>
                        <td>Total Earnings</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>Tickets Sold</td>
                        <td align="right"></td>
                        <td align="right"></td>
                        <td align="right"><?=@$finance['total_matches']?></td>
                        <td align="right">SS$ <?=number_format(@$finance['tickets_sold'])?></td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>Additional Income</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <?php
                      if(isStaffExist($staff_token,'commercial_director')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>Commercial Director Bonus</td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['commercial_director_bonus']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                      <?php endif;?>
                      <?php
                      if(isStaffExist($staff_token,'marketing_manager')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>Marketing Manager Bonus</td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['marketing_manager_bonus']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                      <?php endif;?>
                       <?php
                      if(isStaffExist($staff_token,'public_relation_officer')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>Public Relations Bonus</td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['public_relation_officer_bonus']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                     <?php endif;?>
                      <tr>
                        <td>Sponsors</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['sponsorship']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>Bonuses</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>Wins</td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['win_bonus']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr class="head">
                        <td colspan="5">Total Earnings</td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['total_earnings']))?></td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>Operating Costs</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['operating_cost']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                     
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr class="head">
                        <td colspan="6">Salaries</td>
                      </tr>
                      
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Player Salaries</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['player_salaries']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                      
                       <?php
                      if(isStaffExist($staff_token,'commercial_director')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Commercial Director</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['commercial_director']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                       
                      <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'marketing_manager')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Marketing Manager</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['marketing_manager']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                       
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'public_relation_officer')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Public Relations</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['public_relation_officer']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                      
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'head_of_security')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Head of Security</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['head_of_security']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                        
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'football_director')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Footbal Director</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['football_director']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                        
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'chief_scout')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Chief Scout</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['chief_scout']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                        
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'general_scout')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>general Scout</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['general_scout']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                        
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'finance_director')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Finance Director</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['finance_director']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                       
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'tax_consultant')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Tax</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['tax_consultant']))?></td>
                        <td>&nbsp;</td>
                      </tr>
                       
                       <?php endif;?>
                        <?php
                      if(isStaffExist($staff_token,'accountant')):
                      ?>
                      <tr>
                        <td>&nbsp;</td>
                        <td>Accountant</td>
                        <td>&nbsp;</td>
                        <td align="right"></td>
                        <td align="right">SS$ <?=number_format(abs(@$finance['accountant']))?></td>
                        <td align="right"></td>
                      </tr>
                        
                       <?php endif;?>
                      <tr class="head">
                        <td colspan="4">Total Expenses</td>
                        <td><td align="right">SS$ <?=number_format(@$total_expenses)?></td></td>
                      </tr>
                      <tr class="head">
                        <td colspan="5">Running Balance</td>
                        <td align="right">SS$ <?=number_format(@$finance['budget'])?></td>
                    </tr>
                   </table>
              </div><!-- end #tabs-Keuagan -->
              <div id="tabs-Players">
                <div class="player-list">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Value</th>
                    <th style="text-align:center;">Action</th>
                  </tr>
                 </thead>
                 <tbody  id="myplayerlist">
                  <?php foreach($players as $player):?>
                  <?php
                    switch($player['position']){
                      case 'Goalkeeper':
                        $player_pos = "Goalkeeper";
                        $color = "grey";
                      break;
                      case 'Midfielder':
                        $player_pos = "Midfielder";
                        $color = "yellow";
                      break;
                      case 'Forward':
                        $player_pos = "Forward";
                        $color  = "red";
                      break;
                      default:
                        $player_pos = "Defender";
                        $color = "blue";
                      break;
                    }
                  ?>
                  <tr>
                    <td><a class="yellow" href="<?=$this->Html->url('/manage/player/'.$player['uid'])?>"><?=h($player['name'])?></a></td>
                    <td><?=$player_pos?></td>
                    <?php
                      $performance_bonus = round(floatval($player['last_performance']/100) * 
                                            intval($player['transfer_value']));
                    ?>
                    <td>SS$ <?=number_format(intval($player['transfer_value'])+$performance_bonus)?></td>
                    <td width="10"><a class="icon-cart buttons" href="#"><span>Sale</span></a></td>
                  </tr>
                  <?php endforeach;?>
                 </tbody>
                </table>
                </div><!-- end .player-list -->
              </div><!-- end #tabs-Squad -->
              <div id="tabs-Staff">
                    <div class="staff-list">
                      <?php
                                foreach($staffs as $official):
                          ?>
                            <div class="thumbStaff">
                                <div class="avatar-big">
                                    <img src="<?=$this->Html->url('/content/thumb/default_avatar.png')?>" />
                                </div><!-- end .avatar-big -->
                                <p><?=h($official['name'])?></p>
                                <div>
                                    $<?=number_format($official['salary'])?> / Week
                                </div>
                            </div><!-- end .thumbStaff -->
                            <?php
                                endforeach;
                            ?>
                    </div><!-- end .staff-list -->
                     <div class="row">
                        <a href="<?=$this->Html->url('/manage/hiring_staff')?>" class="button">
                          Manage Staffs</a>
                    </div>
              </div><!-- end #tabs-Staff -->
            </div><!-- end #clubtabs -->
        </div><!-- end .content -->
    </div><!-- end #thecontent -->
</div><!-- end #myClubPage -->
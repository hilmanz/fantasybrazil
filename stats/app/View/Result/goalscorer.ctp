<?php
//pr($result);
?>
<div class="widget">
    <div class="widget-title">
        <h3>GOAL SCORERS</h3>
    </div><!-- end .widget-title -->
    <div class="widget-content">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="blacktable">
        <thead>
              <tr>
                <th class="tcenter"><h5 class="jersey"><img src="http://widgets-images.s3.amazonaws.com/football/team/badges_20/<?=str_replace("t","",@$result['info']['home_team'])?>.png"/></h5></th>
                <th class="tcenter">Vs</th>
                <th class="tcenter"><h5 class="jersey"><img src="http://widgets-images.s3.amazonaws.com/football/team/badges_20/<?=str_replace("t","",@$result['info']['away_team'])?>.png"/></h5></th>
              </tr>
          </thead>
          <tbody>
              <tr>
                <td class="tcenter">
                  <?php
                  if(sizeof(@$result['goals']['home'])>0):
                  ?>
                  <?php foreach(@$result['goals']['home'] as $goal):?>
                    <a class="red-arrow"><?=@$goal['Goal']['player']['name']?> (<?=@$goal['Goal']['time']?>)</a>
                  <?php endforeach;?>
                  <?php endif;?>
                </td>
                <td class="tcenter">&nbsp;</td>
                <td class="tcenter">
                  <?php
                  if(sizeof(@$result['goals']['away'])>0):
                  ?>
                  <?php foreach(@$result['goals']['away'] as $goal):?>
                    <a class="red-arrow"><?=@$goal['Goal']['player']['name']?> (<?=@$goal['Goal']['time']?>)</a>
                  <?php endforeach;?>
                  <?php endif;?>
                </td>
              </tr>
             
          </tbody>                    
        </table>
    </div><!-- end .widget-content -->
</div><!-- end .widget -->
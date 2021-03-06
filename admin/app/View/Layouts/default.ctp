<!DOCTYPE html>
<html>
<head>
	<?php echo $this->Html->charset(); ?>
	<?php echo $this->element('meta'); ?>
</head>
<body>
	<div id="fb-root"></div>
	<div id="effect"></div>
   	<div id="flag"></div>
 	<div id="body">
        <div id="universal">
           <div id="header">
               <a id="logo" href="<?=$this->Html->url('/')?>" title="SUPER SOCCER - FANTASY FOOTBALL LEAGUE">&nbsp;</a>
            	<?php if($USER_IS_LOGIN):?>
                <div id="user-info">
        			<a href="#" class="thumb40 fl"><img src="http://graph.facebook.com/<?=$USER_DATA['fb_id']?>/picture" /></a>
                    <div class="entry fl">
                        <h3 class="username"><a href="<?=$this->Html->url('/profile')?>"><?=h($USER_DATA['name'])?></a> |
                         <a class="logout" href="#">Logout</a></h3>
                        <span class="points red"><?=number_format($USER_POINTS)?> Pts</span>
                        <span class="user-exp">Rookie</span>
                        
                    </div><!-- end .entry -->
                </div>
          		<?php endif;?>
            </div><!-- end #header -->
            <?php
                if($USER_IS_LOGIN):
            ?>
                <div id="navigation">
                	<ul style="">
                    	<li>
                        	<a href="<?=$this->Html->url('/manage/team')?>">MANAGE TEAM</a>
                        </li>
                    	<li>
                        	<a href="<?=$this->Html->url('/manage/club')?>">MY CLUB</a>
                        </li>
                    	<li>
                        	<a href="<?=$this->Html->url('/profile')?>">MY PROFILE</a>
                        </li>
                    	<li>
                        	<a href="<?=$this->Html->url('/leaderboard')?>">LEADERBOARD</a>
                        </li>
                    	<li>
                        	<a href="<?=$this->Html->url('/market')?>">TRANSFER MARKET</a>
                        </li>
                    	<li><a href="<?=$this->Html->url('/pages/faq')?>">HELP &amp; FAQ</a></li>
                    </ul>
                </div>
           
            <?php endif;?>
            <div id="container">
				<?php echo $this->fetch('content'); ?>
            </div><!-- end #container -->
            <div id="footer">
                <div id="footNav">
                  
                    <ul>
                        <li><a href="<?=$this->Html->url('/pages/about')?>">ABOUT FANTASY FOOTBALL LEAGUE</a></li>
                        <li><a href="<?=$this->Html->url('/pages/tos')?>">Terms &amp; Conditions</a></li>
                        <li><a href="<?=$this->Html->url('/pages/contact')?>">Contact</a></li>

                    </ul>
                     <?php
                            if($debug>0):
                        ?>
                            <strong>Cheats</strong>
                            <a class="button" href="<?=$this->Html->url('/manage/reset')?>">Reset</a>
                            <a class="button" href="<?=$this->Html->url('/manage/play_match')?>">Play Match</a>
                            <a class="button" href="<?=$this->Html->url('/manage/reset_matches')?>">Reset All Matches</a>
                            <a class="button" href="<?=$this->Html->url('/manage/reset_stats')?>">Reset All Stats </a>
                            <a class="button" href="<?=$this->Html->url('/manage/reset_finance')?>">Reset Finance</a>
                            <a class="button" href="<?=$this->Html->url('/manage/new_user_event')?>">New User Event</a>
                        <?php
                        endif;?>
                </div>
                
            </div>
        </div><!-- end #universal -->

    </div><!-- end #body -->
	<?php echo $this->element('js'); ?>
    
	<?php echo $this->element('sql_dump'); ?>
</body>
</html>

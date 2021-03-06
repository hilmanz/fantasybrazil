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
            </div><!-- end #header -->
            <?php
                if($USER_IS_LOGIN):
            ?>
                <div id="navigation">
                	<ul>
                    	<li>
                        	<a href="<?=$this->Html->url('/news')?>">News</a>
                        </li>
                    	<li>
                        	<a href="<?=$this->Html->url('/schedules')?>">Schedule</a>
                        </li>
                    	<li>
                        	<a href="<?=$this->Html->url('/players')?>">Players</a>
                        </li>
                    	<li>
                        	<a href="<?=$this->Html->url('/statistics')?>">Statistics</a>
                        </li>
                    	<li><a href="<?=$this->Html->url('/login/logout')?>">Logout</a></li>
                    </ul>
                </div>
           
            <?php endif;?>
            <div id="container">
            	<?php echo $this->Session->flash();?>
				<?php echo $this->fetch('content'); ?>
            </div><!-- end #container -->
            <div id="footer">
                <div id="footNav">
                  
                    
                </div>
                
            </div>
        </div><!-- end #universal -->

    </div><!-- end #body -->
	<?php echo $this->element('js'); ?>
    
	<?php echo $this->element('sql_dump'); ?>
</body>
</html>

<?php
if(isset($item)){
$pic = Configure::read('avatar_web_url').
				"merchandise/thumbs/0_".
				$item['pic'];	
}

?>
<div id="catalogPage">
    <?php echo $this->element('infobar'); ?>
    <?php if($is_transaction_ok):?>
    <div id="thecontent">
        <div class="content">
        	<div class="titlePage">
				<h1 class="red">Online Catalog</h1>
				<h4>Order Complete!</h4>
            </div>
            <div class="rowd">
				<div class="col-content">
					<div class="tr widget">
						<h1>Your order has been successfully processed.</h1>
						<h3>We've also
deducted the balance from your Supersoccer Football manager
funds.</br> Thanks for your purchase!</h3>
						<p><a class="button" href="<?=$this->Html->url('/manage/team')?>">Back to the Game</a></p>
					</div><!-- end .widget -->
				</div><!-- end .col-content -->
				<div class="box4 fr">
					<?php if(isset($item)):?>
					<div class="tr widget order-detail">
						<h2>Your Order</h2>
						<h4><?=h($item['name'])?></h4>
						<p class="price">ss$<?=number_format($item['price_currency'])?></p>
						<div class="imagesCatalog tr widget">
							  <img src="<?=$pic?>" />
						</div>
					</div><!-- end .widget -->
					<?php endif;?>
				</div><!-- end .box4 -->
            </div><!-- end .row-3 -->
        </div><!-- end .content -->
    </div><!-- end #thecontent -->
	<?php else:?>
	<div id="thecontent">
        <div class="content">
        	<div class="titlePage">
				<h1 class="red">Online Catalog</h1>
				<h4>Order Failed!</h4>
            </div>
            <div class="rowd">
				<div class="col-content">
					<div class="tr widget">
						<h1>Your order cannot be processed.</h1>
						<?php if($no_fund):?>
						<h3>Budget loe gak cukup untuk melakukan transaksi ini.</h3>
						<?php else:?>
						<h3>Please try again later !</h3>
						<?php endif;?>
						<p><a class="button" href="<?=$this->Html->url('/manage/team')?>">Back to the Game</a></p>
					</div><!-- end .widget -->
				</div><!-- end .col-content -->
				<div class="box4 fr">
					<?php if(isset($item)):?>
					<div class="tr widget order-detail">
						<h2>Your Order</h2>
						<h4><?=h($item['name'])?></h4>
						<p class="price">ss$<?=number_format($item['price_currency'])?></p>
						<div class="imagesCatalog tr widget">
							  <img src="<?=$pic?>" />
						</div>
					</div><!-- end .widget -->
					<?php endif;?>
				</div><!-- end .box4 -->
            </div><!-- end .row-3 -->
        </div><!-- end .content -->
    </div><!-- end #thecontent -->
	<?php endif;?>
</div><!-- end #catalogPage -->
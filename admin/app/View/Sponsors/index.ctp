<?php
$sponsors = (isset($sponsors))? $sponsors : array();
?>
<h3>Sponsorships</h3>

<div class="row-2">
	<a href="<?=$this->Html->url('/sponsors/create')?>" class="button">Create Sponsorship</a>
</div>
<div class="row-2">
	<h4>Current Sponsors</h4>
<table width="100%">
	<tr>
		<td>No</td>
		<td>Name</td>
		<td>Perks</td>
		<td>Is Available</td>
		<td>Action</td>
	</tr>
	<?php
	foreach($sponsors as $n=>$v):
	?>
	<tr>
		<td><?=$n+1?></td>
		<td><?=h($v['Sponsors']['name'])?></td>
		<td>
			<div class="perk-list-<?=$v['Sponsors']['id']?> perks">
				<?php 
				if(isset($v['perks'])):foreach($v['perks'] as $p):
				?>
					<div><a href="#"><?=$p['name']?> (<?=number_format($p['amount'])?>)</a></div>
				<?php endforeach;endif;?>
			</div>
				<a class="btnPerks" href="#popup-perks" data-id="<?=$v['Sponsors']['id']?>">Add Perks</a>
		</td>
		<td>
			<?php if($v['Sponsors']['is_available']==1):?>
			Yes
			<?php else:?>
			No
			<?php endif;?>
		</td>
		<td><a href="<?=$this->Html->url('/sponsors/edit/'.$v['Sponsors']['id'])?>">Edit</a></td>
	</tr>
	<?php endforeach;?>
</table>
</div>

<div id="popup-perks" style="background-color:#e5e5e5;padding:10px; display:none;">
	<?php foreach($perks as $perk):?>
		<div>
			<a href="#" class="btn btn-perk-selected" data-perkID="<?=$perk['id']?>" 
				data-perkName="<?=$perk['name']?>"
				data-amount="<?=$perk['amount']?>"
				>
				<h4><?=$perk['name']?></h4>
			</a>
			<p style="margin-top:-21px;"><?=$perk['description']?></p>
			<p style="margin-top:0px;"><?=number_format($perk['amount'])?></p>
		</div>
	<?php endforeach;?>
</div>

<script>
var current_id = 0;
$('.btnPerks').click(function(e){
	current_id = $(this).attr('data-id');
});
$('.btn-perk-selected').click(function(e){
	var perkID = $(this).attr('data-perkID');
	var perkName = $(this).attr('data-perkName');
	var amount = $(this).attr('data-amount');
	api_post('<?=$this->Html->url('/sponsors/add_perk')?>',
		{sponsor_id:current_id,
		 perkID:perkID},
		function(response){
			if(response.status==1){
				$(".perk-list-"+current_id).append('<div>'+perkName+' ('+number_format(amount)+')'+'</div>');
			}else{
				//do nothing
			}
			$.fancybox.close();
	});
});
$('.btnPerks').fancybox();
</script>
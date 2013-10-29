
<!DOCTYPE html>
<!--[if lt IE 7]> <html dir="ltr" lang="en-US" class="ie6"> <![endif]-->
<!--[if IE 7]>    <html dir="ltr" lang="en-US" class="ie7"> <![endif]-->
<!--[if IE 8]>    <html dir="ltr" lang="en-US" class="ie8"> <![endif]-->
<!--[if gt IE 8]><!--> <html dir="ltr" lang="en-US"> <!--<![endif]-->

<!-- BEGIN head -->
<head>
	<!--Meta Tags-->
	<meta name="viewport" content="width=device-width; initial-scale=1.0">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
	<!--Title-->
	<title>SUPER SOCCER - FANTASY FOOTBALL LEAGUE</title>

	<?php echo $this->Html->css(
			  array('fflmobile'),
		null,array('media'=>'all')); 
	?>
	<?php echo $this->Html->script(
	  array('jquery-1.9.1',
	  ));
	?>
</head>
<body>
	<div id="body">
		<a href="index.php" id="logo">
			 <img src="<?=$this->Html->url('/images/mobile/logo.png')?>" />
		</a>
		<div id="container">
			<h1>Mau Main di Android?</h1>
			<h3>Download aplikasi Football Manager versi Android untuk mendapatkan pengalaman bermain terbaik</h3>
			<a href="#" class="btn_android"> <img src="<?=$this->Html->url('/images/mobile/android_download.png')?>" /></a>
			<h3 class="yellow">Anda harus terdaftar terlebih dahulu di versi web</h3>
		</div>
		<a href="#" class="btnWeb"> <img src="<?=$this->Html->url('/images/mobile/web_btn.png')?>" /></a>
	</div>
</body>
</html>

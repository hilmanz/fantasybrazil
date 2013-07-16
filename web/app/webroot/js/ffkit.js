//ROUTER
var tmp = {};
var App = Backbone.Router.extend({
  routes:{
    "selectTeam/:team_id":"selectTeam",    
    "select_player/:player_id":"select_player",
    "unselect_player/:player_id":"unselect_player",
    "save_formation":"save_formation",
    "hire/:staff_id":"hire",
    "dismiss/:staff_id":"dismiss",
  },
  hire:hire,
  dismiss:dismiss,
  selectTeam:selectTeam,
  select_player:select_player,
  unselect_player:unselect_player,
  save_formation:save_formation
});
function getStaffSalary(id){
	for(var i in staffs){
		if(staffs[i].id==id){
			return staffs[i].salary;
		}
	}
}
function hire(staff_id){
	$("#staff-"+staff_id).html('<img class="hire-loading" src="'+base_url+'css/fancybox/fancybox_loading.gif"/>');
	api_post(api_url+'game/hire_staff',{id:staff_id},function(response){
			if(typeof response.status!=='undefined' && response.status == 1){
				$("#staff-"+staff_id).html('Hired');
				$("#staff-"+staff_id).attr('href','#/dismiss/'+staff_id);
				est_expenses += getStaffSalary(staff_id);
				console.log(getStaffSalary(staff_id));
				$("h1.expenses").html('EUR '+number_format(parseInt(est_expenses)*4));
			}else{
				$("#staff-"+staff_id).html('Select');
			}
			document.location = "#/";
	});
}
function dismiss(staff_id){
	
	$("#staff-"+staff_id).html('<img class="hire-loading" src="'+base_url+'css/fancybox/fancybox_loading.gif"/>');
	
	api_post(api_url+'game/dismiss_staff',{id:staff_id},function(response){
			if(typeof response.status!=='undefined' && response.status == 1){
				$("#staff-"+staff_id).html('Select');
				$("#staff-"+staff_id).attr('href','#/hire/'+staff_id);
				if(est_expenses>0){
					est_expenses -= getStaffSalary(staff_id);
					if(est_expenses<0){est_expenses = 0;}
					$("h1.expenses").html('EUR '+number_format(parseInt(est_expenses)*4));
				}
			}else{
				$("#staff-"+staff_id).html('Hired');
			}
			document.location = "#/";
	});
}
function save_formation(){
	if(typeof selectedVal['formations'] !== 'undefined'){
		var formation = selectedVal['formations'].value;
		
		//make sure that all the lineup is consist of 11 players.
		getLineups(function(total,lineup){
			if(total==11){
				//save the lineup
				var data = {};
				data.formation = formation;
				for(var i in lineup){
					data[lineup[i].name] = parseInt(lineup[i].value);
				}
				console.log(data);
				if(typeof api_url !== 'undefined'){
					api_post(api_url+'game/save_lineup',data,function(response){
						console.log(response);
					});
				}
			}
		});
	}
	document.location="#";
}
function getLineups(callback){
	var n_player = 0;
	var players = [];
	$.each($("#the-formation").children(),function(k,player){
	    //console.log(player);
	   
	    if($(player).find('a').attr('no')!=undefined){
	    	players.push({
	    		name:'player-'+$(player).find('a').attr('no'),
	    		value: $(player).attr('id').replace('p','')
	    	});
	        n_player++;
	    }
	    if(k>=10){
	        callback(n_player,players);
	    }
	});
}
function selectTeam(team_id,teams){
	$("input[name='team_id']").val(team_id);
	var team_name = "";
	$.each(team_list,function(k,v){
		if(v.uid==team_id){
			$("input[name='team_name']").val(v.name);
			return true;
		}
	});
}
function select_player(player_id){
	isPlayerSelected(player_id,function(check){
		if(!check){
			$.each(tmp['available_teams'],function(k,v){
			 	if(v.uid == player_id){
			 		append_view(player_selected,'#selected',v);
			 		est_expenses += v.salary;
			 		$("span.expense").html(number_format(parseInt(est_expenses)*4));
			 	}
			 });
		}
	});
	 
}
function populate_selected(callback){
	var s = "";
	var n = $("#selected").children().length;
	$.each($("#selected").children(),function(k,v){
			if(k>0){
				s += ",";
			}
			s += $(v).find('a').attr('id');
			if(n-1 == k){
				callback(s);
			}
	});
}
function isPlayerSelected(player_id,callback){
	var n = $("#selected").children().length;
	var isSelected = false;
	if(n>0){
		$.each($("#selected").children(),function(k,v){
			if($(v).find('a').attr('id') == player_id){
				isSelected = true;
			}
			if(n == k+1){
				callback(isSelected);
			}
		});
	}else{
		callback(isSelected);
	}
}
function unselect_player(player_id){
	//$.each($("#selected").children(),function(k,v))
	$.each($("#selected").children(),function(k,v){
		if($(v).find('a').attr('id') == player_id){
			$(v).remove();
			return true;
		}
	});
}
$(document).ready(function(){
  var app = new App();
  Backbone.history.start();
});



//other functions
function api_call(u,c){
	$.ajax({
		  url: u,
		  dataType: 'json',
		  success: c
		}
	);
}
function api_post(u,d,c){
	$.ajax({
	  url: u,
	  dataType: 'json',
	  type:'POST',
	  data:d,
	  success: c});	
}
function render_view(tpl_source,target,data){
	try{
		var View = Backbone.View.extend({
	        initialize: function(){
	            this.render();
	        },
	        render: function(){
	            var variables = data;
	            var template = _.template($(tpl_source).html(),variables);
	            this.$el.html(template);
	        }
	    });
	    var view = new View({el:$(target)});
	    
   }catch(error){
   		console.log(error.message);
   }
}
function prepend_view(tpl_source,target,data){
	try{
		var View = Backbone.View.extend({
	        initialize: function(){
	            this.render();
	        },
	        render: function(){
	            var variables = data;
	            var template = _.template($(tpl_source).html(),variables);
	            this.$el.prepend(template);
	        }
	    });
	    var view = new View({el:$(target)});
   }catch(error){
   	 	
   }
}
function append_view(tpl_source,target,data){
	try{
		var View = Backbone.View.extend({
	        initialize: function(){
	            this.render();
	        },
	        render: function(){
	            var variables = data;
	            var template = _.template($(tpl_source).html(),variables);
	            this.$el.append(template);
	            this.$el.css('display','none');
	            this.$el.fadeIn();
	        }
	    });
	    var view = new View({el:$(target)});
	    
   }catch(error){
   	 
   }
}

// http://kevin.vanzonneveld.net
// Strip all characters but numerical ones.
function number_format (number, decimals, dec_point, thousands_sep) {
  
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
$(function(){
	var keyword = $('#keyword');
	$("#search_button").bind("click",function(){
		if( keyword.val() == '' ){
			keyword.focus();
			return;
		}
		var s = $('#query_form');
		$('#query_form #page').val(1);
		$('#query_form #f').val('');
		s.submit();
	});
	$(".pager_btn").bind("click",function(){
		$(this).html('正在加载..');
		var search_list = $(".search_list ul");
		var s = $('#query_form');
		//var url = s[0].action;
		var page = $('#query_form #page');
		page.val(parseInt(page.val()) + 1);
		var data = s.serialize();
		$.ajax({
	        type: 'get',
	        url: '/search/ajax',
	        dataType: 'json',
	        data: data,
	        cache: false,
	        success: function (json) {
				var totalCount = json.totalCount;
				if( totalCount > 0 ){
					for(var i = 0; i < json.list.length; i++){
						var j = json.list[i];
						var li = [];
						li.push('<li class="tl_shadow">');
						li.push('<a href="/file/' + j.id + '" >');
							li.push('<div class="list-item" >');
								li.push('<i class="file-icon ' + j.file_icon + '"></i>');
								li.push('<div class="content" >');
									li.push('<h3>');
									li.push('' +  j.filename + '');
									if( j.title != j.filename ){
										li.push('' +  j.title + '');
									}
									li.push('</h3>');
									li.push('<div class="list-content">');
									if( j.file_share_url.length > 45 ){
										li.push('' + j.file_share_url.substring(0,45) + '');
									}else{
										li.push('' + j.file_share_url.substring(0,(file_share_url.length-3)) + '');
									}
									li.push('...</div>');
								li.push('</div>');
							li.push('</div>');
							li.push('<div class="ti_author_time" >');
								li.push('<span class="ti_author" ><img src="/images/logo_baiduyun.png" /> ' + j.userName + '</span>');
								li.push('<span class="ti_time" >\u5206\u4EAB\u65F6\u95F4\uFF1A' + (new Date(parseInt(j.feed_time)).Format("yyyy-MM-dd"))  + '</span>');
							li.push('</div>');
						li.push('</a>');
						li.push('</li>');
						search_list.append(li.join(''));
					}
				}
				$(".pager_btn").html('点击加载下一页');
	        },
	        error: function (XmlHttpRequest) {
	        	$('#query_form #page').val(parseInt($('#query_form #page').val()) - 1);
	            $(".pager_btn").html('点击加载下一页');
	            alert("Send Error! ! Please try again ...");
	        }
	    });
	});
	var timeOutId = null;
	$("#keyword").keyup(function(){
 		var q = $.trim($(this).val());
 		q = q.replace(/(^\s*)|(\s*$)/g,"");
 		if( q.length <= 0 ||  q.length >= 15 ){
 			$(".list-suggest").html('');
 			$(".search .clear").attr('display','none');
 			return;
 		}
 		q = encodeURIComponent(q);
 		timeOutId && window.clearTimeout(timeOutId);
 		timeOutId = setTimeout(function() {
	 		$.ajax({
		        url: '/search/suggest?q=' + q,
		        dataType: "json",
		        cache: false,
		        success: function (json) {
		        	if( json.length > 0 ){
		        		$('.suggestion').show();
		        	}
		    		var s = '';
		    		var url_path = $("#url_path").val();
		    		for (var i = 0; i < json.length; i++) {
		    			s += '<li><a href="/' + url_path + '?keyword=' + json[i].encode_keyword + '" class="link"><span>' + json[i].keyword + '</span><span style="font-size:12px;">(' + json[i].result + ')</span></a></li>';
		    		}
		    		s += '<li class="last"><a class="s_close" href="javascript:suggest_close();">关闭</a></li>';
		    		$(".list-suggest").html(s);
		    		$(".search .clear").attr('display','inline');
		        }
	    	});
 		}, 1000);
	});
	if ($("#jback")[0]) {
        $("body").delegate("#jback", "click",function() {
    		if( history.length > 1){ 
    			window.history.back();
    		}else{
    			document.location='/';
    		}
        });
    };
	if ($("#jentry")[0]) {
		$("#jentry").bind("click",function(){
			if( $(this).hasClass("open") ){
				$(this).toggleClass("open");
				$(this).find(".inner").height(60);
				$("#jentryBtn").find("i").removeClass("icon-up").addClass("icon-down");
			}else{
				$(this).toggleClass("open");
				$(this).find(".inner").height($(this).find(".txt").height());
				$("#jentryBtn").find("i").removeClass("icon-down").addClass("icon-up");
			}																																																																																																																					  
		});
	}
});
function suggest_close(){
	$("#keyword").val('');
	$(".list-suggest").html('');
	$(".search .clear").attr('display','none');
};
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
function report_file(fid){
	window.location.href = '/report?fid=' + fid;
};
function report_user(fid){
	window.location.href = '/report?uk=' + fid;
};

	$(document).ready(
		function() {
			$('.fancybox').fancybox();
			$('.fancybox-buttons').fancybox(
			{
				openEffect : 'none',
				closeEffect : 'none',
				prevEffect : 'none',
				nextEffect : 'none',
				closeBtn : false,
				helpers : {
					title : {
						type : 'inside'
					},
					buttons : {}
				},
				afterLoad : function() {
					this.title = 'Image '
							+ (this.index + 1)
							+ ' of '
							+ this.group.length
							+ (this.title ? ' - '
									+ this.title : '');
				}
			});
		});
	
	var serverTime = 0;	
	var bidEndDate = '1611460800000';
	var countDownTimeout = null;
	var memid = '116628';
	var account = 'Hsu09**';
	var auid = '493909';
	function onMessage(event) {		
		var json;
		var no;
		try {						
			json = JSON.parse(event);		
			no = json.no;		
		} catch (e) {
			alert(e.message);
		}
		
		switch(no) {
			case 1: //更新物品價格與出價下拉選單					
				document.getElementById('detailSize').innerHTML = json.detailSize;
				genBidPriceDropdownList(json.money, json.detailSize);
				
				$("#isStop").val(json.stop);
				$("#stopDateString").html(json.stopDateString);
				$("#stopDateString").show();
				break;
			case 3: //更新出價記錄				
				var rows = json.detail;			
				var bidHisHtml = '<table width="100%" class="vtable"><thead><tr><th width="8%">價格排行</th><th width="27%">金額</th><th width="30%">出價時間</th><th width="35%">出價者</th></tr></thead>';						
				for(var i = 0 ; i < rows.length ; i++) {
					var intime = rows[i].intime == 'N'?false:true;
					bidHisHtml+='<tbody><tr '+((intime)?'':'style="background-color:pink;"')+'  >';
					bidHisHtml+='<td><center>'+rows[i].sort+'</center></td>';
					bidHisHtml+='<td>'+rows[i].bidprice+'元</td>';
					bidHisHtml+='<td>'+rows[i].bidtime+'</td>';
					bidHisHtml+='<td>'+rows[i].account+((intime)?'':'<font color=red>(逾時)</font>')+'</td>';
					bidHisHtml+='</tr></tbody>';
				}			
				bidHisHtml += '</table>';			
				document.getElementById('bidHisHome').innerHTML = bidHisHtml;
				document.getElementById('bidHisNum').innerHTML = '出價紀錄('+rows.length+')';				
				break;
			case 4: //校正時間											
				serverTime = json.serverTime;				
				if(countDownTimeout != null) {
					clearTimeout(countDownTimeout);
				}				
				document.getElementById('hiddenFrame').src = '../../home/home00/keep';
				countDownTimeout = setTimeout(chgTime, 1000);				
				break;
			case 5: //顯示訊息
				fancyAlert(json.msg);				
				break;
			case 6: //改變頁籤			
				new Spry.Widget.TabbedPanels('TabbedPanels1').showPanel(parseInt(json.tag));
				break;
			case 7: //更新拍賣截止日		
				bidEndDate = json.bidEndDate;				
				document.getElementById('newBidEndDateHome').innerHTML = json.bidEndDateStr;
				break;				
			case 9: //更新問與答			
				var rows = json.detail;	
				var bidForumHtml = '';
				for(var i = 0 ; i < rows.length ; i++) {
					var name = rows[i].name;
					var charStr = '詢問者：';
					if(name.substring(name.length-2) != '**') {
						charStr = '回覆者：';
					}
					bidForumHtml+= '<table width="100%" class="mtable"><tbody>';											
					bidForumHtml+='<tr><td width="13%">'+charStr+'</td>';
					bidForumHtml+='<td width="37%">'+name+'</td>';
					bidForumHtml+='<td width="13%">時間：</td>';
					bidForumHtml+='<td width="37%">'+rows[i].posttime+'</td>';																										
					bidForumHtml+='</tr>';
					bidForumHtml+='<tr>';
					bidForumHtml+='<td>內容：</td>';
					bidForumHtml+='<td colspan="3" valign="top" style="height:100px;">'+rows[i].msg+'</td>';
					bidForumHtml+='</tr></tbody></table><br/>';
				}
				document.getElementById('bidForumHome').innerHTML = bidForumHtml;
				document.getElementById('askNum').innerHTML = '問與答('+rows.length+')';				
				break;			
			case 20:				
				document.getElementById('canBidHome').innerHTML = '本案您可出價'+json.bidTime+'次，已出價'+json.alrdyBid+'次';
				break;
		}
	}
	
	
	var perMin = 0;
	function chgTime() {
		
		if ("Y" == $("#isStop").val()) {
			$("#bidButton").html("停權中");
			$(".maybeRed").html("停權中");
			$(".maybeRed").prop("style", "background:none;color:red");
			
			/* var bbStyle = $("#bidButton").prop("style");
			bbStyle += ";color:red;"
				$("#bidButton").prop("style", bbStyle); */
		} else {
			$(".maybeRed").hide();
		}
		
		var time = (parseInt(bidEndDate)-parseInt(serverTime))/1000;
		perMin++;
		
		if(time < 0) {			
			//document.getElementById('star').style.display = 'none';			
			document.getElementById('canBidHome').style.display = 'none';
			
			if(memid != '') {				
				document.getElementById('bidButton').onclick = function() { fancyAlert("拍賣時間已經截止"); }
				document.getElementById('bidButton').innerHTML = '已截止';
				
				$('#bidForumContentHome').hide();
				$('#bidForumButtonHome').hide();				
			}
			document.getElementById('wholePriceHome').style.display = 'none';
			document.getElementById('time_end').innerHTML = '<font color="red">00</font>天<font color="red">00</font>時<font color="red">00</font>分<font color="red">00</font>秒 結束';
			if(document.getElementById('bidButtonDiv') != null) {
				document.getElementById('bidButtonDiv').style.visibility = '';
			}
			return;
		} else if(perMin == 60) {						
			perMin = 0;			
			webSocket_send(getJson(4));			
		}
		
		if(time > 0) {
			document.getElementById('star').style.display = '';			
			document.getElementById('wholePriceHome').style.display = '';
			document.getElementById('canBidHome').style.display = '';
			$('.search_btn').show();
			$('#bidForumContentHome').show();
			$('#bidForumButtonHome').show();
		}
		
		if(document.getElementById('bidButtonDiv') != null) {
			document.getElementById('bidButtonDiv').style.visibility = '';
		}
		
		
		var day = parseInt(time/86400);
		var hr = parseInt((time-86400*day)/3600);
		var min = parseInt((time-86400*day-3600*hr)/60);
		var second = parseInt(time-86400*day-hr*3600-min*60);

		document.getElementById('time_end').innerHTML = '<font color="red">'+fillZero(day)+'</font>天<font color="red">'+fillZero(hr)+'</font>時<font color="red">'+fillZero(min)+'</font>分<font color="red">'+fillZero(second)+'</font>秒 結束';		
		serverTime = (parseInt(serverTime)+1000)+''; 		
		countDownTimeout = setTimeout(chgTime, 1000);
		
		if ("Y" == $("#isStop").val()) {
			//$("#wholePriceHome").hide();
			$("#canBidHome").hide();
			
		}
	}
	
	var sizeTmp = -1;	
	function genBidPriceDropdownList(_currentPrice, detailSize) {		
		if(sizeTmp != detailSize) {			
			loadBidHis();			
			sizeTmp = detailSize;
		} else {
			return;
		}
				
		
		var m = [500, 1000, 5000, 10000, 50000, 100000, -1];
		var p = [10, 20, 30, 100, 300, 500, 1000];		
		var currentPrice = parseInt(_currentPrice);
		
		var myPrice = document.getElementById('bidprice').value;
		
		var html = "<select id='bidprice' style='font-size:20px;'>";		
		
		if(detailSize == 0) {
			html += '<option value="'+currentPrice+'">'+currentPrice+'</option>';
		}
		
		for(var i = 0 ; i < m.length ; i++) {
			if(currentPrice <= m[i] || m[i] == -1) {
				for(var j = 0 ; j < 10 ; j++) {						
					currentPrice = currentPrice + p[i];
					html+= '<option value="'+currentPrice+'">'+currentPrice+'</option>';				
				}
				break;
			}
		}		
		html+='</select>';
		
		document.getElementById('bidpriceHome').innerHTML = html;
		document.getElementById('txt_money').innerHTML = addComma(_currentPrice)+'元';
		
		if(myPrice) {
			$('#bidprice option[value='+myPrice+']').attr('selected', 'selected');
		}
	}
	
	function addComma(x) {		
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");		
	}
	
	function webSocket_send(data) {
		
		var data = {message: data, TIME:  new Date().getTime()};
		
		fancyAjax('../../product/product00/websocket', data, function(response) {					
			onMessage(response);			
	    }, null);						
	}
	
	function webSocket_send_callback(data, callback) {
		
		var data = {message: data, TIME:  new Date().getTime()};
		
		fancyAjax('../../product/product00/websocket', data, function(response) {					
			onMessage(response);			
			callback();	
	    }, null);						
	}
	
	function onOpen() {	
		
		updateBidInfo();
		
		webSocket_send(getJson(10, '493909')); //問與答
				
	}	
	
	function updateBidInfo() {
		webSocket_send(getJson(1, auid)); //取得物品價格	
		webSocket_send(getJson(4)); //取得Server時間
		if(memid != '' && '1' == '1') {
			webSocket_send(getJson(20, auid, '', memid)); //取得出價次數
		}
	}

	
	var bidButtonClicked = false;
	var isSuspended = false;
	var isEmailVerified = true;
	var isSNSVerified = true;
	function goBid() {				
		if(memid != '') {		
			if(isSuspended) {
				fancyAlert('停權中無法出價');
				return;
			}
			
			if(!isEmailVerified) {
				fancyAlert('尚未通過Email驗證');
				return;
			}
			
			if(!isSNSVerified) {
				fancyAlert('尚未通過簡訊驗證');
				return;
			}
			
			
				loadCaptcha(auid, document.getElementById('bidprice').value);
			
			
			
			
			
		} else {
			fancyAlert('請先登入');
		}
	}
	
	function loadCaptcha(auid, bidprice) {
		var caphref = "../../product/product00/showCaptcha" + "?auid=" + auid + "&bidprice=" + bidprice;
		$.fancybox({ 
			'closeBtn' : true,  
			maxHeight:900, 			
			minHeight: 150,
			maxWidth:500,
		    type: 'iframe', 
		    href: caphref,		    
		    helpers : { 
				overlay : { closeClick: false } 
			}, keys : {
				close : null
			}
		});
		
		
	}
	
	function bidIframeCallBack() {
		$('.fancybox-inner').height(parseInt($('.fancybox-iframe').contents().find(".bidIframe").height())+30);
		$.fancybox.reposition();
	}
	
	function captchaBid(captcha, mainKey,token) {
		//console.log("23:"+captcha+":"+ mainKey);
		goCaptchaBid(captcha, mainKey,token);
		
	}
	
	function goCaptchaBid(captcha, mainKey,token) {				
		if(memid != '') {		
			if(isSuspended) {
				fancyAlert('停權中無法出價');
				return;
			}
			
			if(!isEmailVerified) {
				fancyAlert('尚未通過Email驗證');
				return;
			}
			
			if(!isSNSVerified) {
				fancyAlert('尚未通過簡訊驗證');
				return;
			}
			
			if(bidButtonClicked) {				
				fancyAlert('出價資訊傳送中...請稍候');
			} else {
				
				bidButtonClicked = true;					
				webSocket_send_callback(getJson2(2, auid, document.getElementById('bidprice').value, memid, '101.10.74.221',…
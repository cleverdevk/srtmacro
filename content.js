function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}

var dsturl1 = "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";

if (document.URL.substring(0, dsturl1.length) == dsturl1) {

	$(document).ready(function() {
		injectJs(chrome.extension.getURL('inject.js'));

		var coachSelected = JSON.parse(sessionStorage.getItem('coachSelected'));
		var firstSelected = JSON.parse(sessionStorage.getItem('firstSelected'));
		var waitSelected = JSON.parse(sessionStorage.getItem('waitSelected'));
		if (coachSelected == null) coachSelected = [];
		if (firstSelected == null) firstSelected = [];
		if (waitSelected == null) waitSelected = [];
		console.log("coach:" + coachSelected);
		console.log("first:" + firstSelected);
		console.log("first:" + waitSelected);

		if (sessionStorage.getItem('macro') == "true") {
			$("#search-list").append('<a href="#" onclick="macrostop();" style="margin-left:5px;"><img src="' + chrome.extension.getURL('images/btn_stop.png') + '"></a>');
		} else {
			$("#search-list").append('<a href="#" onclick="macro();" style="margin-left:5px;"><img src="' + chrome.extension.getURL('images/btn_start.png') + '"></a>');
		}

		$("<style>")
    .prop("type", "text/css")
    .html("\
    .search-form form .button input, .search-form form .button a img{\
    	vertical-align: middle;\
    }")
    .appendTo("body");

		// Inserts the macro button into the table.
		if ($("#search-list").length != 0) {
			var rows = $('#search-list #result-form div.tbl_wrap.th_thead table tbody tr');
			for (i = 0; i < rows.length; i++) {
				console.log("i: "+ i);
				var columns = $(rows[i]).children('td');
				var first = $(columns[5]);
				var coach = $(columns[6]);
				var wait = $(columns[7]);
				console.log(coach.children);
				console.log(first.children);
				if (coach.children().length > 0) {
					coach.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="coachMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', coachSelected.indexOf(i+"") > -1);
					coach.append(checkbox);
				}
				if (first.children().length > 0) {
					first.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="firstMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', firstSelected.indexOf(i+"") > -1);
					first.append(checkbox);
				}
				if (wait.children().length > 0) {
					wait.append($("<p class='p5'></p>"));
					var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="waitMacro" value="' + i + '"> 매크로');
					checkbox.children('input').prop('checked', waitSelected.indexOf(i+"") > -1);
					wait.append(checkbox);
				}
			}
		}

		if (sessionStorage.getItem('macro') == "true") {
			// Restores user preferences
			$("#psgInfoPerPrnb1").val(sessionStorage.getItem('psgInfoPerPrnb1'));
			$("#psgInfoPerPrnb5").val(sessionStorage.getItem('psgInfoPerPrnb5'));
			$("#psgInfoPerPrnb4").val(sessionStorage.getItem('psgInfoPerPrnb4'));
			$("#psgInfoPerPrnb2").val(sessionStorage.getItem('psgInfoPerPrnb2'));
			$("#psgInfoPerPrnb3").val(sessionStorage.getItem('psgInfoPerPrnb3'));
			$("#locSeatAttCd1").val(sessionStorage.getItem('locSeatAttCd1'));
			$("#rqSeatAttCd1").val(sessionStorage.getItem('rqSeatAttCd1'));

			if ($("#search-list").length != 0) {
				var rows = $('#search-list #result-form div.tbl_wrap.th_thead table tbody tr');
				console.log(rows)

				var succeed = false;
				for (i = 0; i < rows.length; i++) {
					var columns = $(rows[i]).children('td');

					var first = $(columns[5]);
					var coach = $(columns[6]);
					var wait = $(columns[7]);

					if (coachSelected.indexOf(i+"") > -1) {
						var coachSpecials = coach.children("a");
						if (coachSpecials.length != 0) {
							for (j = 0; j < coachSpecials.length; j++) {
								name = $(coachSpecials[j]).attr('class');
								console.log(name)
								if (name == 'btn_small btn_burgundy_dark val_m wx90') {
									$(coachSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}

					if (firstSelected.indexOf(i+"") > -1) {
						var firstSpecials = first.children("a");
						if (firstSpecials.length != 0) {
							for (j = 0; j < firstSpecials.length; j++) {
								name = $(firstSpecials[j]).attr('class');
								console.log(name);
								if (name == 'btn_small btn_burgundy_dark val_m wx90') {
									$(firstSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}
					if (waitSelected.indexOf(i+"") > -1) {
						var waitSpecials = first.children("a");
						if (waitSpecials.length != 0) {
							for (j = 0; j < waitSpecials.length; j++) {
								name = $(waitSpecials[j]).attr('class');
								console.log(name);
								if (name == 'btn_small btn_burgundy_dark val_m wx90') {
									$(waitSpecials[0])[0].click();
									succeed = true;
									break;
								}
							}
							if (succeed == true) break;
						}
					}
				}

				if (succeed == true) {
					sessionStorage.removeItem('macro');
					sessionStorage.removeItem('coachSelected');
					sessionStorage.removeItem('firstSelected');
					sessionStorage.removeItem('psgInfoPerPrnb1');
					sessionStorage.removeItem('psgInfoPerPrnb5');
					sessionStorage.removeItem('psgInfoPerPrnb4');
					sessionStorage.removeItem('psgInfoPerPrnb2');
					sessionStorage.removeItem('psgInfoPerPrnb3');
					sessionStorage.removeItem('locSeatAttCd1');
					sessionStorage.removeItem('rqSeatAttCd1');
					chrome.extension.sendMessage({type: 'playSound'}, function(data) { });
					//특실 전용 코로나 안내 메세지 제거
					document.querySelector('.ui-dialog-buttonset').querySelector('.ui-button').click();
				} else {
					setTimeout(function() { 
					location.reload();
					}, 1000);
				}
			} else {
				history.go(-1);
			}
		}
	});
}

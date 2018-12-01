// ==UserScript==
// @name            Habr Comments Unmark
// @description     Marks comments as unread
// @author          Konstantin Vlasov (@CaptainFlint)
// @namespace       Habrahabr
// @version         1.0
// @include         https://habr.com/*
// @grant           none
// ==/UserScript==

"use strict";

!function(win) {

if (window != window.top)
	return;

function mark_impl(dt) {
	$('.comment__head_new-comment').removeClass('comment__head_new-comment');
	$('.js-comment_new').removeClass('js-comment_new');

	$(".js-comment")
		.filter(function (index, el) {
			var parts = $('> .comment > .comment__head > time', el).text().split(' в ');
			parts[0] = '20' + parts[0].split('.').reverse().join('-')
			return (parts.join(' ') >= dt);
		})
		.addClass('js-comment_new')
		.find('> .comment > .comment__head')
		.addClass('comment__head_new-comment');

	$('#xpanel > span').show();
	$('#xpanel > span.new').text($('.js-comment_new').length);
}

win.addEventListener("load", function() {
	function fmt2(v) {
		return ((v > 9) ? '' : '0') + v;
	}
	var d = new Date();
	var df = d.getFullYear() + '-' + fmt2(d.getMonth() + 1) + '-' + fmt2(d.getDate()) + ' ' + fmt2(d.getHours()) + ':' + fmt2(d.getMinutes());
	$('.comments-section__subscribe-panel').prepend('<div style="font-size: smaller;">Развидеть: <input type="text" id="unmark_count" value="' + $('#xpanel > span.new').text() + '" style="width: 4em; text-align: right;" /> <input type="button" id="unmark_count_do" value="штук" /> или с момента <input type="text" id="unmark_date" value="' + df + '" style="width: 10em; text-align: right;" /> <input type="button" id="unmark_date_do" value="OK" /></div>');
	$('#unmark_date_do').on("click", function() {
		var dt = $('#unmark_date').val();
		mark_impl(dt);
	});
	$('#unmark_count_do').on("click", function() {
		var cnt = $('#unmark_count').val();
		var timestamps = [];
		$(".js-comment").each(function (index, el) {
			var parts = $('> .comment > .comment__head > time', el).text().split(' в ');
			parts[0] = '20' + parts[0].split('.').reverse().join('-')
			timestamps.push(parts.join(' '));
		});
		timestamps.sort();
		if (cnt > timestamps.length) {
			cnt = timestamps.length;
		}
		var dt = timestamps[timestamps.length - cnt];
		mark_impl(dt);
	});
}, false);

}(typeof unsafeWindow == 'undefined' ? window : unsafeWindow);

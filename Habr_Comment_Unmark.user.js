// ==UserScript==
// @name            Habr Comments Unmark
// @description     Marks comments as unread
// @author          Konstantin Vlasov (@CaptainFlint)
// @namespace       Habrahabr
// @version         1.1
// @include         https://habr.com/*
// @grant           none
// ==/UserScript==

"use strict";

!function(win) {

if (window != window.top)
	return;

function fmt2(v) {
	return ((v > 9) ? '' : '0') + v;
}

// Convert date from a comment header into comparable string
function translateDate(d) {
	var parts = d.split(' в ');
	if (parts[0] == 'сегодня') {
		parts[0] = loadDate.getFullYear() + '-' + fmt2(loadDate.getMonth() + 1) + '-' + fmt2(loadDate.getDate());
	}
	else if (parts[0] == 'вчера') {
		var yesterday = new Date(loadDate.getTime() - 24 * 3600 * 1000);
		parts[0] = yesterday.getFullYear() + '-' + fmt2(yesterday.getMonth() + 1) + '-' + fmt2(yesterday.getDate());
	}
	else {
		parts[0] = '20' + parts[0].split('.').reverse().join('-')
	}
	return parts.join(' ');
}

var loadDate = new Date();

function mark_impl(dt) {
	$('.comment__head_new-comment').removeClass('comment__head_new-comment');
	$('.js-comment_new').removeClass('js-comment_new');

	$(".js-comment")
		.filter(function (index, el) {
			return (translateDate($('> .comment > .comment__head > time', el).text()) >= dt);
		})
		.addClass('js-comment_new')
		.find('> .comment > .comment__head')
		.addClass('comment__head_new-comment');

	$('#xpanel > span').show();
	$('#xpanel > span.new').text($('.js-comment_new').length);
}

win.addEventListener("load", function() {
	var loadDateFmt = loadDate.getFullYear() + '-' + fmt2(loadDate.getMonth() + 1) + '-' + fmt2(loadDate.getDate()) + ' ' + fmt2(loadDate.getHours()) + ':' + fmt2(loadDate.getMinutes());
	$('.comments-section__subscribe-panel').prepend('<div style="font-size: smaller;">Развидеть: <input type="text" id="unmark_count" value="' + $('#xpanel > span.new').text() + '" style="width: 4em; text-align: right;" /> <input type="button" id="unmark_count_do" value="штук" /> или с момента <input type="text" id="unmark_date" value="' + loadDateFmt + '" style="width: 10em; text-align: right;" /> <input type="button" id="unmark_date_do" value="OK" /></div>');
	$('#unmark_date_do').on("click", function() {
		var dt = $('#unmark_date').val();
		mark_impl(dt);
	});
	$('#unmark_count_do').on("click", function() {
		var cnt = $('#unmark_count').val();
		var timestamps = [];
		$(".js-comment").each(function (index, el) {
			timestamps.push(translateDate($('> .comment > .comment__head > time', el).text()));
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

$(document).ready(function(){
	$('.card').hide();

    $('#sidebar-toggle').click(function() {
		$('.card').slideToggle("slow", function() {

		});
	});

	$("#search").keypress(function(e) {
	    if(e.which == 13) {
	        alert('You pressed enter!');
	        // TODO: Make API calls to Google, Amazon, and Twitter and populate those tabs
	    }
	});

	chrome.runtime.getBackgroundPage(function (backgroundPage) {
    	alert(backgroundPage.syntax_tree);
	});
});
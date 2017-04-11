var syntax_tree = {};

chrome.browserAction.onClicked.addListener(function(activeTab) {
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function(tabs) {
		var mercury_api_key = "Ms3wkoFBuDyr8nWdnVE12PrjMKuEiGrE3w9Nh9ns" // API Key for Mercury Web Parser
		var url = tabs[0].url;

		var request_url = "https://mercury.postlight.com/parser?url=";
		request_url += url;

		$.ajax({
		  	url: request_url,
		    type: "GET",
		    contentType: "application/json",
		    beforeSend: function(xhr) {
					xhr.setRequestHeader("x-api-key", mercury_api_key);
				},
		    success: function(result) {
		    		// TODO: make request to server to get syntax_tree

		    		chrome.tabs.create({ url: "../reader.html", active: true });
				}
		 });
	});
});
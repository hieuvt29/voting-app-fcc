'use strict';

(function() {
    var content = document.querySelector("#content");

    var apiUrlAllPolls = appUrl + '/api/allpolls';
    var apiUrlOnePoll = appUrl + '/api/:pollId';
    var apiUrlUserPolls = appUrl + '/api/:userId';

    function append(text, element) {
        // var txt1 = "<p>Text.</p>"; // Create element with HTML  
        // var txt2 = $("<p></p>").text("Text."); // Create with jQuery
        // var txt3 = document.createElement("p"); // Create with DOM
        // txt3.innerHTML = "Text.";

        var li = $("<li class='poll'></li>").text(text);
        $(".poll-list").append(li); // Append the new elements 
    }

    ajaxFunction.ready(ajaxFunction.ajaxRequest('GET', url, function(data) {
        var polls = JSON.parse(data);

        var pollList = $("<ul class='poll-list'></ul>");
        if (typeof(data) == 'Array') {
            for (var i = 0; i < data.length; i++) {
            	append(data[i].title, pollList);
            }
        }
    }))
})();



window.onload=function(){
// find template and compile it
// find template and compile it
window.offset=0;
window.limit=10;



var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing',
    audioObject = null;

var fetchTracks = function (albumId, callback) {
    console.log('inside fetchTracks');
	$.ajax({
		 	
        url: 'https://api.spotify.com/v1/tracks/' + albumId,
        success: function (response) {
            callback(response);
        }
		
    });
	    

};

var searchAlbums = function (query, artist_name, offset, limit) {
//	offset=0;
//	limit=10;
	console.log(query);
	console.log(artist_name);
	//var query_final=query  + " artist:" + artist_name;
	query_final=query.concat(encodeURI(" artist:"));
	query_final=query_final.concat(artist_name);
	
		console.log(query_final);
	//	console.log(query_final);
	//	console.log(query_final);
	parameters = [];
	parameters.push(['q', query_final]);

	parameters.push(['offset', window.offset]);
	parameters.push(['limit', window.limit]);
	parameters.push(['type', 'track']);

	
	var message = {
		'action' : 'https://api.spotify.com/v1/search',
		'method' : 'GET',
		'parameters' : 	parameters
	};
	
	var parameterMap = OAuth.getParameterMap(message.parameters);
	//console.log(message.action);
/*
	$.ajax({
		'url' : message.action,
		'data' : parameterMap,
		//'dataType' : 'jsonp',
		//'jsonpCallback' : ,
		'cache': true,
		'success' : function(data, textStats, XMLHttpRequest) {
			
----------------------------			
	*/		
	console.log(message);	
		console.log(parameterMap);		
	
    $.ajax({
       // url: 'https://api.spotify.com/v1/search',
	    url: message.action,
        data: parameterMap,
        success: function (response, textStats, XMLHttpRequest) {
      console.log(response); 
	  resultsPlaceholder.innerHTML = template(response);
        }
    });
};

results.addEventListener('click', function (e) {
            console.log('inside event listener');
            
	var target = e.target;
	console.log(target.getAttribute('data-album-id'));
    if (target !== null && target.classList.contains('cover')) { //changed here from 'cover'
        console.log('inside if');
		if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            fetchTracks(target.getAttribute('data-album-id'), function (data) {
                console.log("below is data");
				console.log(data);
				audioObject = new Audio(data.preview_url); //changed from data.items[0].preview_url
                audioObject.play();
                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function () {
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function () {
                    target.classList.remove(playingCssClass);
                });
            });
        }
    }

});

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value, document.getElementById('artist_name').value);
//	$(document.getElementById("results")).paginate();

}, false);

document.getElementById('search-form2').addEventListener('submit', function (e) {
    e.preventDefault();
    offset=offset+10;
    var limit=10;
    searchAlbums(document.getElementById('query').value, document.getElementById('artist_name').value, offset, limit);
//	$(document.getElementById("results")).paginate();

}, false);
		//$(document.getElementById('results').paginate());
		
	

//		$(document.getElementById("results")).paginate();
			
}//]]> 


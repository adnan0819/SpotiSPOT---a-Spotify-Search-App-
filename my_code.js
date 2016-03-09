

window.onload=function(){

$("#artist_name").hide();
$("#album_name").hide();
$("#genre_name").hide();
$("#sliderThing").hide();

window.offset=0;
window.limit=10;
window.length=0;

//basic helper function to do math in Handlebars.js

Handlebars.registerHelper('addition', function(context, options){
    return context + parseFloat(options.hash.to);
});

Handlebars.registerHelper('subtraction', function(context, options){
    return context - parseFloat(options.hash.to);
});

Handlebars.registerHelper('multiplication', function(context, options){
    return context * parseFloat(options.hash.to);
});

Handlebars.registerHelper('division', function(context, options){
    return context / parseFloat(options.hash.to);
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2-10) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


//Making the year range using JQuery UI

$(function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 1900,
      max: new Date().getFullYear(),
      values: [1900 ,  new Date().getFullYear()],
      slide: function( event, ui ) {
        $( "#year" ).val( " " + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#year" ).val( " " + $( "#slider-range" ).slider( "values", 0 ) +
      " - " + $( "#slider-range" ).slider( "values", 1 ) );
	  
		
  });
  

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
//	colon=""
	var artist_name=document.getElementById('artist_name').value;
	
	console.log(query);
	console.log(artist_name);
	if(document.getElementById('artist_name').value!="") {
		var query_final=query+ " artist:" + artist_name;
		console.log(query_final);
	}
	else{
		query_final=query;
	}
	
	var album_name=document.getElementById('album_name').value;
	if(document.getElementById('album_name').value!="") {
		var query_final=query_final+ " album:" + album_name;
		console.log(query_final);
	}
	else{
		query_final=query_final;
	}
	
	var genre_name=document.getElementById('genre_name').value;
	if(document.getElementById('genre_name').value!="") {
		var query_final=query_final+ "genre:" + "\""+genre_name+"\"";
		console.log(query_final);
	}
	else{
		query_final=query_final;
	}
	
	var start = $( "#slider-range" ).slider( "values", 0 );
	start=start.toString()
	var end = $( "#slider-range" ).slider( "values", 1 ).toString();
	end=end.toString()
	var thisYear=new Date().getFullYear();
	thisYear=thisYear.toString();
	if(start.valueOf()=="1900" && end.valueOf()==thisYear.valueOf()){
		console.log("slide didn't move");
		}
	else{
		console.log(start);
		console.log(end);
		query_final=query_final+ " year:" + start + "-" + end;
	}


	
	if ($('#query').val().length == 0 && $('#artist_name').val().length == 0 && $('#genre_name').val().length == 0 && $('#album_name').val().length == 0) {
		resultsPlaceholder.innerHTML= "<h4>You need to input something! Please check for typos or broaden the search. </h4>";
		$("#next").hide();
		window.nothing=1;
		
        return false;
	}

	
	
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
	
		
    $.ajax({
       // url: 'https://api.spotify.com/v1/search',
	    url: message.action,
        data: parameterMap,
        success: function (response, textStats, XMLHttpRequest) {
			
      console.log(response); 
	  window.t=1;
	  console.log(window.length); 
	  resultsPlaceholder.innerHTML = template(response);
	  window.length = response.tracks.total;
	  	  console.log("in ajax"); 
		  if(window.length<=10){
				$("#next").hide();  
				$("#prev").hide();  
		  }

		  console.log(window.length); 

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

$("#next").hide();
$("#prev").hide();

document.getElementById('advanced').addEventListener('click', function (e) {
    e.preventDefault();
	$("#artist_name").show();
	$("#album_name").show();
	$("#genre_name").show();
	$("#sliderThing").show();
	$("#advancedLink").hide();
	$("#query ~ placeholder").html("Type track name");
	

}, false);


document.getElementById('basic').addEventListener('click', function (e) {
    e.preventDefault();
	$("#artist_name").hide();
	$("#album_name").hide();
	$("#genre_name").hide();
	$("#sliderThing").hide();
	$("#advancedLink").show();
	document.getElementById('query')
	$("#query ~ placeholder").html("Type track name");
	

}, false);

document.getElementById('toTop').addEventListener('click', function (e) {
    e.preventDefault();
	$(window).scrollTop(0);
	
}, false);



if(window.length<=10 && offset==0){
		console.log('This one man ' + window.length);
	$("#prev").hide();
	$("#next").hide();
	
	} 

	
document.getElementById('search-form').addEventListener('submit', function (e) {
    
	e.preventDefault();
	window.offset=0;
	offset=0;
    searchAlbums(document.getElementById('query').value, document.    getElementById('artist_name').value);
	
	if(offset==0) {
		if(window.length>10){
			console.log("first page with more pages");
			console.log(window.length);
			$("#prev").hide();
			$("#next").show();
		}
		
		else { //in first page but that's the only one
			console.log("Empty");
			console.log(window.nothing);
			if(window.nothing===1){
				$("#prev").hide();
				$("#next").hide();
				window.nothing=0;
			}
			
		else{
		console.log("second branch");
		console.log(window.length);
		$("#prev").hide();
		$("#next").show();}
		}
		//$("#advancedLink").hide();
	
	}

}, false);


document.getElementById('search-form2').addEventListener('click', function (e) {
	console.log("INSIDE NEXT");
	console.log(offset);
	console.log(window.length);
	
    e.preventDefault();
    
	offset=offset+10;
    var limit=10;
	
	//So that first page of results has no "Previous" button
	if(offset!=0) {
		console.log("first page");
		$("#prev").show();
	}
	
	//so that last page of results have no "Next" button
	if(offset>=window.length-10){
		console.log("last page");
		$("#prev").show();
		$("#next").hide();		
	}
		
    searchAlbums(document.getElementById('query').value, document.getElementById('artist_name').value, offset, limit);
	$("#artist_name").hide();
	$("#album_name").hide();
	$("#genre_name").hide();
	$("#sliderThing").hide();
	$("#advancedLink").show();
	$(window).scrollTop(0);

}, false);

document.getElementById('prev').addEventListener('click', function (e) {
	console.log("INSIDE PREV");
	console.log(offset);

    e.preventDefault();
    offset=offset-10;
    var limit=10;
	if(offset==0) {
		console.log("first page");
		$("#prev").hide();
		$("#next").show();
	}
	
    searchAlbums(document.getElementById('query').value, document.getElementById('artist_name').value, offset, limit);
	$("#artist_name").hide();
	$("#album_name").hide();
	$("#genre_name").hide();
	$("#sliderThing").hide();
	$("#advancedLink").show();
	$(window).scrollTop(0);
	

}, false);

		
}
# SpotiSPOT - a Spotify Search App 

I have built a Spotify search app and named it ‘SpotiSPOT’ leveraging the Spotify API. 

***Technologies and Libraries used (with justification and dependency)***

1. Pure Javascript
2. JQuery
3. HTML5
4. CSS3
5. Twitter Bootstrap (only the CSS file to format the results)
6. HandlebarsJS (for looping through the results)
7. JQueryUI (only to implement the “slider” to input ‘year range’ – screenshots attached later)
[There are no online dependency except for the actual Spotify API. All required files are attached and submitted.]

***How to run***

Step 1: Download the folder named HW1 (as a contingency, I have also included a ZIP archive outside it but you will not need that if you download the folder)
Step 2: Simply open “index.html” in your browser (and please make sure you have internet connectivity so you can actually see the results through the API – but the app itself has no online dependency)
Step 3: In the “Advanced Search” mode, you can slide the sliders to define range of year.
Explanation: The ‘advanced search’ works on an AND logic. Say you search for ‘Nirvana’ with the year range 1900-present year. You would get 1523 songs (with other artists with the word Nirvana in it like “Approaching Nirvana”. Now, if we use the slider to narrow down to 2012- 2015, we will get 398 songs.

* learn how to consume a long-lived HTTP stream
* learn how to poll an API and watch for changes
* learn how to connect command line tools using pipes
* be introduced to the `jq` and `websocketd` tools
* learn how to consume from a websocket inside a browser using javascript

roughly, our schedule looks like

* curl the bitly stream
* discuss how we are receiveing data
* quickly review pipes, and meet `jq`
* make a websocket server using `websocketd`
* log the stream in the browser's console log

**BREAK**

* curl the citibike API
* do the same with python
* detect changes to citibike stations, serve via websocket
* build a page, served with a python simple server, that uses d3 to modify DOM elements in the browser

We'll finish by talking about the exercise.

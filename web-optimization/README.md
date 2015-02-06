## Website Performance Optimization portfolio project

####Part 1: Optimize PageSpeed Insights score for index.html

Steps:
1. Created an "analytics.js" where I moved the google analytics code and added an async attribute. (Deskto: Raised my page speed from 77-87, Mobile: 27).
2. Added a media="print" tage to the print.js script. (Desktop:87, Mobile: 74)
3. Compressed all jpg images using "jpegtran -copy none -progressive test.jpg > test-opt.jpg" (Deskto: 90, Mobile: 77)
4. Added my fonts as @font-faces int the style.css so browser doesn't have to download extra critical resource (Desktop: 92, Mobie: 85)

####Part 2: Optimize Frames per Second in pizza.html

-Generate less pizaas in document.addEventlistener (fom 200 to 35)
-in the updatePositions() function I took out document.body.scrollTop from within a for loop because it can just be calculated once. 
-in function changePizzaSizes() I took out the length condition from the for loop. 
-took out document.querySelectorAll(".randomPizzaContainer") from within the for loop in changePizzaSizes() and places it ina variable. 
-take out // This for-loop actually creates and appends all of the pizzas when the page loads
var randomPizza = document.getElementById("randomPizzas"); put the variable outisde of the for loop (line 476)
-placed the image creation var image = "images/pizza.png"; outside of the pizzaElementGenerator() field. 
-IMPORTANT: updatePositions: took out items variable. Does not have to be recalculated. 
-IMPORTANT: in changePizzaSizes() there's no need to calculate the width of each idnividual pizza since they'll all be changed to the same width. I took the width calculation out of hte for loop. 
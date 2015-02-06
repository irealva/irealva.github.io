## Website Performance Optimization portfolio project

####Part 1: Optimize PageSpeed Insights score for index.html

Steps:

1. Created an 'analytics.js' where I moved the google analytics code and added an async attribute. (Desktop: Raised my page speed from 77-87, Mobile: 27).

2. Added a 'media="print"'' tag to the 'print.js' script. (Desktop:87, Mobile: 74)

3. Compressed all jpg images using "jpegtran -copy none -progressive test.jpg > test-opt.jpg" (Desktop: 90, Mobile: 77)

4. Added my fonts as @font-faces int the style.css so browser doesn't have to download an extra critical resource (Desktop: 92, Mobile: 85)

####Part 2: Optimize Frames per Second in pizza.html

Steps taken to speed up the frame rate:

1. I changed the number of Pizza Elements created from 200 to 40 since screens aren't too large. 40 pizzas are more than enough to fill the screen. This code is in the event listener that fires when the DOM content loads.

2. In the updatePositions() function: I took out the document.body.scroppTop from within the for loop because it can just be calculated once.

3. In function changePizzaSizes(): I took out the 'document.querySelectorAll(".randomPizzaContainer")' from within the for loop and placed it in a variable. 

4. Took out 'document.getElementById("randomPizzas")' from a for loop on line 467. Not necessary to call it from within the loop. 

5. In the updatePositions() function: took out the items variable and placed it within the DOM event listener. Does not have to be queried each time updatePositions is called. 

6. In the changePizzaSizes() function: no need to calculate the width of each individual pizza since they'll all be changed to the same width. Took out the width calculation out of the for loop

7. To display the scrolling pizzas: I used animation to reduce fps. 



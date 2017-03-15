# JStudio
An animation studio package written in Javascript for use in browser or with Node.js. It has no dependencies and can be included as a single .js file.

## Demos
 - [hello_world_example.html](https://samm.github.io/JStudio/hello_world_example.html)
 - [resize_popup_example.html](https://samm.github.io/JStudio/resize_popup_example.html)

## JStudio.Recorder
The `JStudio.Recorder` class is used to record animations to be played by the JStudio.Player class.
```
// Create a new instance of JStudio.Recorder
var recorder = new JStudio.Recorder();
```
The animation is stored as an array of frames, which are themselves functions. These functions get called when the frames are entered by the player.
Each instance of `JStudio.Recorder` has a `next`, a `goto` and an `export` method, as well as a `recording` datafield which is where the animation array is stored.
Each frame consists of a function which iterates through an array of consequent functions and calls each in sequence. The array of functions can be added to by using the chain methods returned by the `next` and `goto` methods.
### recorder.next(job) => returns function(job){}
The `recorder.next` method adds a new frame to the end of the `recorder.recording` array and returns a chain method which takes a function as a parameter. This chain method adds the function which is passed into it to the array of functions which gets executed every time the frame function is called. The chain method also returns itself so the chain can be continued indefinitely. The function which you pass into the chain method gets passed a single parameter `stage` which contains an object which can be used to store elements relevant to the animation.
#### Example:
```
// Add a new frame to the recording
var frame = recorder.next();

// Do something in the frame:
frame(function(stage){
  console.log("First frame of my animation.");
  stage.awesomeness = 100%;
});

function sayYay(){ console.log("YAY!") };

// Say YAY! three times in one frame
recorder.next(sayYay)(sayYay)(sayYay);

// Say YAY! five times in five seperate frames
for(var i=0; i<5; i++){
  recorder.next(sayYay);
}
```
### recorder.goto(index) => returns function(job){}
The `recorder.goto` method takes one parameter (`index`) and will return the chain method for the frame at the specified index.
#### Example:
```
// Select the first frame
var first = recorder.goto(0);

// Set up a play counter that increments every time the animation starts again
first(function(stage){
  stage.playCount = stage.playCount || 0;
  stage.playCount++;
});

// Log the play count to the console too
first(function(stage){
  console.log("Play number: "+stage.playCount);
});
```
### recorder.export => returns Array
The `recorder.export` method returns the `recorder.recording` datafield which is the array of frame functions which has been recorded.
## JStudio.Player
The `JStudio.Player` class is used to load a recording made by the `JStudio.Recorder` class and play it as an animation.
Each instance of `JStudio.Player` has a `load` method which is used to load a recording. Once a recording is loaded the player can then animated it.
```
// Create an instance of the JStudio.Player class and load the recording
var player = new JStudio.Player();
player.load(recorder.export());
```
### player.frameRate : Number
This datafield determines the frame rate at which the animation plays. It is the number of frames that are played per second.
### player.loop : Boolean
This datafield determines whether the animation should loop or not.
### player.reverse : Boolean
This datafield determines whether the animation should play is reverse or not.
```
// Set player settings (these are the defaults)
player.frameRate = 60;
player.loop = false;
player.reverse = false;
```
### player.play()
This method is used to play the animation.
### player.stop()
This method will stop playing the animation immediately.
### player.render()
This method 'renders' the current frame by calling it's function.
### player.goto(index)
This method sets the current frame to the `index` (Number) and renders the frame.
### player.step()
This method goes to the very next frame in the animation and renders it.

All methods of the `JStudio.Player` class return the player instance itself, so methods can be chained to each other like so:
```
// Goto frame 3 and play from there
player.goto(3).play();

// Stop in three seconds and go back to the start
setTimeout(function(){
  player.stop().goto(0);
}, 3000);
```

## JStudio.record Helper Methods
There are also many helper methods stored within the `JStudio.record` namespace which can be used to generate useful functions to be used in animations.
```
// Log to console in frame 0

// Using lambda:
recorder.goto(0)(function(){ console.log("Hello World!") });

// Using Helper Method
recorder.goto(0)(JStudio.record.console.log("Hello World!"));
```
There are helper methods for DOM Elements under the `JStudio.record.element` namespace. These can be used to manipulate the DOM from within the animation.
There are helper methods for using the JStudio.Player methods under the `JStudio.record.player` namespace. These can be used to control the player from within the animation.

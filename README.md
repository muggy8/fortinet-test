# About
This is the app building test for Fortinet.

## Setup
The contents of this repository is to be placed in the htdocs folder of a apache server. The server must have PHP running as well. A folder called deps needs to be created and the uploader php file is to be placed in there (the class.uploader.php file) if it's not already.

## Solution A
This app is built upon AngularJS because I am fairly familiar with the framework and does not require a complex build process unlike React. I also considered using my own personal library that I build but it still is fairly unrefined and would need a few more iterations.

As this app is built using Angular, this app is functionally a Single Page Application. As a result, all interactions with the PHP code is done though AJAX requests.

Because the app is just a web file browser, there isn't any additional views outside of the main view. This also means that there is no router involved. However outside of the main view, there are a number of dialogue boxes that will appear from time to time. These are implemented as their own isolated view and controller that will appear when needed.

Because this is a web based file browser, drag and drop file uploads is very important, as a result drag and drop file uploads is implemented on the main view as well as the file selector view.

Remembering of the file names is implemented with a metadata file on the server within each folder. This file hidden from the user unlike other dot files and is functionally just a JSON file. The PHP end points all update this file in the appropriate folder when a file name is changed beyond the original. I felt that this is the best way of doing things because it allows the file names to be stored on a persistent storage that can be shared between different users and across sessions.

Another alternative to doing this is to store information within a database. However this adds more complexity to the project for marginal gains and reduces portability of the project.

The CSS of this project is a bit complicated. The idea is to use the custom variables of CSS and the functionality of CSS allowing properties to be overwritten to create a simple yet complex set of rule that interacts with each other to always produce a look and feel that is consistent with the basic styles set out by the design. Currently the only thing that uses this heavily is the button stylings. This button is able to respond to various contexts and remain consistent without the dev having to remember which button style works with a certain backgrounds. This also takes away the need to choose which button works best for any particular background which results in inconsistent button looks across the UI. Of course this method can be extended to other components such as links and texts.

Finally, I attempted to add as much error catching as I can to make it fairly easy to realize what went wrong while using the app. Additionally there are some very well defined requirements for what is and isn't allowed and this made it easier automatically fix some user errors such as excluding incompatible file types and alerting the user of such. However I would say I am not able to find all of the user errors that may happen so this represents the best I can find of possible user errors.

## Solution B
Solution B is found under the taskb folder. Once this project is setup you can visit [http://localhost/taskb/](http://localhost/taskb/) to view my answer for task B

There really isn't much to say about this task as it's more of a math puzzle than anything.

## Git
Should you be interested in the dev process of this code base. Feel free to visit [https://github.com/muggy8/fortinet-test](https://github.com/muggy8/fortinet-test) to see the git logs.

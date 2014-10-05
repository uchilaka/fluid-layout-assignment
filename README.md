fluid-layout-assignment
=======================

Example of fluid layout with angularjs and JQuery for Javascript awesomeness and jStorage for state persist

<h2>Installation</h2>
There are 2 installation options:
<ul>
	<li>Via Bower</li>
	<li>From Github</li>
</ul>

<h3>Bower</h3>
Install via <a href="http://bower.io/" target="_blank">Bower</a>:
<pre>
bower install uchilaka-ng-layout-task
</pre>
Then, copy the contents of the uchilaka-ng-layout-task directory to the root of your new application and run as a HTML5 App.

<h3>Github</h3>
Download the ZIP folder or clone this Git repository

<h2>Notes</h2>
Development and testing done with the <a href="https://netbeans.org/downloads/" target="_blank">Netbeans IDE</a>

<h2>Assumptions</h2>
<ul>
  <li>"Last box in the grid" refers to the last box to be added</li>
  <li>ID for each box should should be same as numeric sequence number</li> 
  <li>Lightest gray allowed is rgb(248,248,248) and darkest gray allowed is rgb(128,128,128)</li> 
  <li>Friendly message for box deletion is cleared after approx. 5 seconds</li>
  <li>Deleting the first box is not allowed</li>
</ul>

<h2>On CSS grids and layouts</h2>
The layouts here were done with pure CSS and a lot of help from AngularJS for the dynamic responses. Plugins available 
for rendering layouts include skeljs (<a href="http://skeljs.org" target="_blank">http://skeljs.org</a>) or using the grid layout in a framework like Bootstrap 
(<a href="http://getbootstrap.com" target="_blank">http://getbootstrap.com</a>).

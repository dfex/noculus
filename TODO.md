##TODO

###Visualisation

* ~~Fix CSS for to provide a darker theme~~
* ~~Click node to toggle selection~~
* Shift-clicking node adds to selection (mutex brush?)
* Brush selection should only need to touch object, not absolute coordinates (should this de-select existing objects?)
* ~~Links need to attach to the center of an object regardless of its shape - eg: [locx + (width / 2), locy + (height / 2)]~~
* ~~Clicking on links should "select" them (highlight)~~
* Mouse-over links should display a label
* Mouse-over nodes should display a label
* Add scroll-to-zoom
* Remove height and width from JSON and create a custom property that can be styled against instead (eg: chassis, tor with .css values for height and width)
* Write a small prototype that shows the objects as retrieved from JSON and use console log to determine how to retrieve attributes correctly (d.width etc.)


###Network Intergation

* Use Junos PyEZ to pull real nodes into topology file
* Use LLDP adjancies to programmatically determine links

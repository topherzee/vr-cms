2023-03-05

Remove dragged item from Content.
* remove it from content_tree. (splice)
* rerender the page.

On hover, add back to contentTree (as tentatative.)

Need to get hilighting to work.
Need to saave to somewhere which item is hilighted - so that when it is rendered again it shows hilighted.
------

Objective right now is to move an item with cursor/controller.

Challenges
Move sometning with gazecursor. Possible with mouseup aand mousedown?

Can we make the item aa child of the gaze object? That would kind of be the threejs attaach hack.

https://aframe.io/docs/1.4.0/components/raycaster.html
https://aframe.io/docs/1.4.0/introduction/interactions-and-controllers.html#gaze-based-interactions-with-cursor-component
https://github.com/stemkoski/A-Frame-Examples/blob/master/laser-controls.html


https://developer.oculus.com/documentation/web/browser-remote-debugging/
No Connection coming up on Quest? Probably the cable is not good enough!
adb devices

chrome://inspect/#devices

March 1 2022 - I got the moving of items with the hands to work!

HOw can I get it working again in the browser with "gaze based" control? Works by WASD!!!

Next up is to rerender the page based on the location of the dragged item.
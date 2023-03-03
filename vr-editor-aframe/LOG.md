Run this from command line:
browser-sync start --server --files="**/*" --https

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
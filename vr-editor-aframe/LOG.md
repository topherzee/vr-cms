

2023-04-02
Fast load of header images.
Refactor "page.js" into render.js, view-page.js, view-menu.js .. in preparation for adding assets.

2023-04-01

Throwing works!

2023-03-31
WOrk on: Auto-Detect VR/Desktop. Enable controls appropriately.
https://immersive-web.github.io/webxr/input-explainer.html

Tricky - sometimes the hoveritem does not show in VR (but works on desktop)
Seems related to trying to hide the cursor and failing.
If you comment out of index.html then it works.
 <a-entity id="cursor"


2023-03-17
Clean up visuaals for show and tell.
Standardized colors. Got the Outline to be transparent.

Current problem - when you let go of the item it should dissapear - the draaggy, but now it creates a hole in the layout.

2023-03-07

Remember which element we added - so we can take it back again.
Get it from the parentArraay and the ID.

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
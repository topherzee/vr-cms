RUN IT:
Run this from command line:
browser-sync start --server --files="**/*" --https

OR To Start
http-server -S -C cert.pem
DEBUG:
adb devices
Go to chrome://inspect#devices

----
TODO:

Throw item to get rid of it. (fun)
Add imaage to one of the components.
Add a Magnolia header to the very top.
Add an App header to the top of the two apps.
Add assets app.
Support dragging asset onto page.

Drag and Drop Page and Component Menu?
Ability to place things in 3d instead of only "in the grid."
Animate item snaapping baack into place if not used.

----

How the Dragging works in 3D:

Component called "mover".
It is applied to aframe "laser-controls" and to the aframe "cursor". 

All entities that can be moved have class "movable".

HOVER
Listens for "raycaster-intersection" and "raycaster-intersection-cleared".
On either event, get the current first intersected element and call "setHover()"

setHover() 
If "is_dragging" - then try to detect when raycaster is on a DROP TARGET.

IF sethover is not "is_dragging"
* clears out hoverEl, if something was being hoverd - sets the color back.
* sets "hoverEl" to the element being raycast intersected.

DRAGGING
Listens for "mousedown" and "mouseup" (Which also captures 'laser' conroller trigger input)
* sets and clears "is_dragging"
* mousedown: if "hoverEl" is set, then color it pink and attaches hoverEl to the controller.
* mouseup: 
    * if "hoverEl" is set, then set color back and attach to scene. (BUT: should attach to new parent.)
    * if "hoverEl" is not set... then check raycaster because we might be on something now.

is_dragging is only true if mousing with button down AND an item is in hoverstate.
----
KEY STATE: 
is_dragging - Whether a block is being dragged. (Set in startDrag())
hoverEl
hoverDropEl
draggedBlockConfig
tentative_id

SOON
dragged_parentArray
dragged_index


STEPS FOR SUCCESSFUL DRAG & DROP
* Ray Intersection event
    If not dragging, calls setHover()
        Sets HoverEl
* Mousedown on an element 
    Calls startDrag(). 
        Sets is_dragging 
        Sets draggedBlockConfig
* Hover over a Drop Target
    checkForDropHover()
        Either startDropHover or stopDropHover
        startDropHover()
            Sets hoverDropEl
            Injects into content_tree and rerenders.
        stopDropHover()
            Clears hoverDropEl
            Removes from conent_tree and rerenders.
* Mouseup - Checks for is_dragging.
    

----
How to simplify. Its very buggy now.

Consider making the rayCast events into over events "mouseover" "mouseout"
----


Alternatives to browsersync which appeaars to have issues. 
https://github.com/arnoson/vite-plugin-live-reload?ref=morioh.com&utm_source=morioh.com

https://www.npmjs.com/package/budo ????
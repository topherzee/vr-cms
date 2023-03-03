RUN IT:
To Start
http-server -S -C cert.pem

Go to chrome://inspect#devices
adb devices


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




Alternatives to browsersync which appeaars to have issues. 
https://github.com/arnoson/vite-plugin-live-reload?ref=morioh.com&utm_source=morioh.com

https://www.npmjs.com/package/budo ????
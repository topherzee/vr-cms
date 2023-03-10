VR EDITOR - HTML Pre version.

Run this from command line:
browser-sync start --server --files="**/*"

----
h1. STATE

* content_tree - This is the full content tree of the page. It gets updated as things go on. The page is rendered based on this.
* component_menu - List of the components that can be added.

* drags - array of all dragTargets
* drops - aarray of all dropTargets

* isDragging - is an item being dragged.
* activeDrop - the droptarget hovered over (HTML element)
* activeDrag - the drag handle hovered over (HTML element) IS THIS NEEDED?
* idOfDropTarget - 
* idOfDraggedItem
* draggedBlockConfig - 
* x - coordinates of mouse
* y - coordinates of mouse

MECHANISM
During dragging item is removed from content_tree.
During dragging - a special "draggy" DOM element is moved around by the mouse.

When over a drop target - the dragged items config (draggedBlockConfig) is inserted into content_tree (and flagged as "tentative")

When a drag is stopped, and not over a target - item is snaapped back to original location.



----
When dragging an item.

For starters - the basics.

Temporary new content model for the move.
Item is removed from model.

Based on mouse position, the content array that makes most sense is hilighted.

Based on mouse position, a TRY_OUT element is added to the model (and therefore rendered.)

If user stops DRAG, then the TRY_OUT item is made permanent and the model is made real.

TODO: practice hilighting conent-array.
Practice hilighting item.

New TRY_OUT item is added to model
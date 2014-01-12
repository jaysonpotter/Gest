(function (Gest) {
    'use strict';
    
    // All the touchy and interactive - gleamed from JoiStyk Sun Aug 11, 2013
    var touchable = typeof (document.ontouchend) !== "undefined",
        msPointy = typeof (window.navigator.msPointerEnabled) !== "undefined",
        interactiveArea = document.getElementById('touchThis'),
        touches = [],
        changedTouches = [],
        trackPosition,
        lastTouchID,
        coords,
        pointStart,
        pointEnd,
        pointMove,
        pointLeave,
        pointCancel,
        debugOutput;
        
    // this sets the listener names, I like it this way
    if (touchable) {
        pointStart = 'touchstart';
        pointEnd = 'touchend';
        pointMove = 'touchmove';
        pointCancel = 'touchcancel';
        pointLeave = 'touchleave';
        interactiveArea.innerHTML = "Touch Here";
    } else if (msPointy) { // TOATS EXPERIMENTAL, I feel this might lock in the event and fight with mouse
        pointStart = 'MSPointerDown';
        pointEnd = 'MSPointerUp';
        pointMove = 'MSPointerMove';
        pointCancel = 'MSPointerOver';
        pointLeave = 'MSPointerOut';
        interactiveArea.innerHTML = "Pointer Here";
    } else {
        pointStart = 'mousedown';
        pointEnd = 'mouseup';
        pointMove = 'mousemove';
        interactiveArea.innerHTML = "Click Here";
    }
    // Gets the position of the mouse or up to two touches

    function getPosition(interactiveArea, evt) {
        evt.preventDefault();
        var rect = interactiveArea.getBoundingClientRect();
        if (touchable) {
            /*
var j,
                len;
            for (j = 0, len = touchEventProps.length; j < len; j++) {
                prop = touchEventProps[j];
                event[prop] = touch[prop];
            }
*/
            if (touches.length === 1) {
                coords = {
                    // this tracks a single touch
                    x1: evt.targetTouches[0].clientX - rect.left,
                    y1: evt.targetTouches[0].clientY - rect.top
                };
            } else if (touches.length === 2) {
                coords = {
                    // this tracks two touches
                    x1: evt.targetTouches[0].clientX - rect.left,
                    y1: evt.targetTouches[0].clientY - rect.top,
                    x2: evt.targetTouches[1].clientX - rect.left,
                    y2: evt.targetTouches[1].clientY - rect.top
                };
            }
        } else {
            coords = {
                x1: evt.clientX - rect.left,
                y1: evt.clientY - rect.top
            };
        }
        return coords;
    }

    function handleStart(evt) {
        evt.preventDefault();
        
        touches = evt.targetTouches;
        trackPosition = getPosition(interactiveArea, evt);
        interactiveArea.className = "awesome";
        if (touchable) {
            if (touches.length > 1 && touches.length <= 2) {
                interactiveArea.innerHTML = "Two finger tap y'all!";
                debugOutput.innerHTML = "Start X1: " + trackPosition.x1 + " Start Y1: " + trackPosition.y1 + "<br>";
                debugOutput.innerHTML += "Start X2: " + trackPosition.x2 + " Start Y2: " + trackPosition.y2 + "<br>";
            } else if (touches.length >= 3) {
                interactiveArea.className = "sorry";
                interactiveArea.innerHTML = "You have " + touches.length + " taps.<br>I don't have anything for that yet. Too much power!";
            } else {
                interactiveArea.innerHTML = "You have the touch! You have the power!";
                debugOutput.innerHTML = "Start X1: " + trackPosition.x1 + " Start Y1: " + trackPosition.y1 + "<br>";
            }
        } else {
            interactiveArea.innerHTML = "You have the click! You have the power!";
            debugOutput.innerHTML = "Start X1: " + trackPosition.x1 + " Start Y1: " + trackPosition.y1 + "<br>";
        }
    }

    function handleMove(evt) {
        evt.preventDefault();

        touches = evt.targetTouches;
        trackPosition = getPosition(interactiveArea, evt);
        if (touchable) {
            if (touches.length > 1 && touches.length <= 2) {
                interactiveArea.innerHTML = "You have " + touches.length + " active, moving touches.";
                debugOutput.innerHTML = "Move X1: " + trackPosition.x1 + " Move Y1: " + trackPosition.y1 + "<br>";
                debugOutput.innerHTML += "Move X2: " + trackPosition.x2 + " Move Y2: " + trackPosition.y2 + "<br>";
            } else if (touches.length >= 3) {
                interactiveArea.className = "sorry";
                interactiveArea.innerHTML = "You have " + touches.length + " touches.<br>I don't have anything for that yet. Too much power!";
            } else {
                interactiveArea.innerHTML = "You have " + touches.length + " active, moving touches.";
                debugOutput.innerHTML = "Move X1: " + trackPosition.x1 + " Move Y1: " + trackPosition.y1 + "<br>";
            }
        } else {
            interactiveArea.innerHTML = "You're moving your mouse around.";
            debugOutput.innerHTML = "Move X1: " + trackPosition.x1 + " Move Y1: " + trackPosition.y1 + "<br>";
        }
    }

    function handleEnd(evt) {
        evt.preventDefault();
        touches = evt.targetTouches;
        changedTouches = evt.changedTouches;
        if (touchable) {
            //console.dir(evt);
            if (changedTouches.length === 1) {
                lastTouchID = changedTouches[0].identifier;
            }
            if (touches.length > 1 && touches.length <= 2){
                interactiveArea.className = "awesome";
            }
            if (touches.length === 0) {
                interactiveArea.className = "";
                interactiveArea.innerHTML = "Touch Here";
                debugOutput.innerHTML = "Last Touch ID: " + lastTouchID;
            }
        } else {
            interactiveArea.className = "";
            interactiveArea.innerHTML = "Click Here";
        }
    }

    function handleCancel(evt) {
        evt.preventDefault();
        // touches = evt.changedTouches;
        if (touchable) {
            //for (var i = 0; i < touches.length; i++) {}
        }
    }
    Gest.play = function (el) {
        interactiveArea = el;
        interactiveArea.addEventListener(pointStart, handleStart, false);
        interactiveArea.addEventListener(pointEnd, handleEnd, false);
        interactiveArea.addEventListener(pointCancel, handleCancel, false);
        interactiveArea.addEventListener(pointLeave, handleEnd, false);
        interactiveArea.addEventListener(pointMove, handleMove, false);
    };
    Gest.debug = function (outputEl) {
        debugOutput = outputEl;
    };
}(window.Gest = window.Gest || {}));
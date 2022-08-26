// uniwheel 0.1.2 (customized)
// A unified cross browser mouse wheel event handler
// https://github.com/teemualap/uniwheel

var Utils = require("./utilities");

module.exports = (function() {
  //Full details: https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel

  var prefix = "",
    _addEventListener,
    _removeEventListener,
    support,
    fns = [];
  var passiveTrueOption = { passive: true };
  var passiveFalseOption = { passive: false };

  // detect event model
  if (Utils.getGlobalThis().addEventListener) {
    _addEventListener = "addEventListener";
    _removeEventListener = "removeEventListener";
  } else {
    _addEventListener = "attachEvent";
    _removeEventListener = "detachEvent";
    prefix = "on";
  }

  function getSupport() {
    if (!support) {
      support =
        "onwheel" in document.createElement("div")
          ? "wheel" // Modern browsers support "wheel"
          : document.onmousewheel !== undefined
          ? "mousewheel" // Webkit and IE support at least "mousewheel"
          : "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
    }
    return support;
  }

  function createCallback(element, callback) {
    // detect available wheel event

    var fn = function(originalEvent) {
      !originalEvent && (originalEvent = window.event);

      // create a normalized event object
      var event = {
        // keep a ref to the original event object
        originalEvent: originalEvent,
        target: originalEvent.target || originalEvent.srcElement,
        type: "wheel",
        deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
        deltaX: 0,
        delatZ: 0,
        preventDefault: function() {
          originalEvent.preventDefault
            ? originalEvent.preventDefault()
            : (originalEvent.returnValue = false);
        }
      };

      // calculate deltaY (and deltaX) according to the event
      if (getSupport() == "mousewheel") {
        event.deltaY = (-1 / 40) * originalEvent.wheelDelta;
        // Webkit also support wheelDeltaX
        originalEvent.wheelDeltaX &&
          (event.deltaX = (-1 / 40) * originalEvent.wheelDeltaX);
      } else {
        event.deltaY = originalEvent.detail;
      }

      // it's time to fire the callback
      return callback(event);
    };

    fns.push({
      element: element,
      fn: fn
    });

    return fn;
  }

  function getCallback(element) {
    for (var i = 0; i < fns.length; i++) {
      if (fns[i].element === element) {
        return fns[i].fn;
      }
    }
    return function() {};
  }

  function removeCallback(element) {
    for (var i = 0; i < fns.length; i++) {
      if (fns[i].element === element) {
        return fns.splice(i, 1);
      }
    }
  }

  function _addWheelListener(elem, eventName, callback, isPassiveListener) {
    var cb;

    if (getSupport() === "wheel") {
      cb = callback;
    } else {
      cb = createCallback(elem, callback);
    }

    elem[_addEventListener](
      prefix + eventName,
      cb,
      isPassiveListener ? passiveTrueOption : passiveFalseOption
    );
  }

  function _removeWheelListener(elem, eventName, callback, isPassiveListener) {
    var cb;

    if (getSupport() === "wheel") {
      cb = callback;
    } else {
      cb = getCallback(elem);
    }

    elem[_removeEventListener](
      prefix + eventName,
      cb,
      isPassiveListener ? passiveTrueOption : passiveFalseOption
    );

    removeCallback(elem);
  }

  function addWheelListener(elem, callback, isPassiveListener) {
    _addWheelListener(elem, getSupport(), callback, isPassiveListener);

    // handle MozMousePixelScroll in older Firefox
    if (getSupport() == "DOMMouseScroll") {
      _addWheelListener(
        elem,
        "MozMousePixelScroll",
        callback,
        isPassiveListener
      );
    }
  }

  function removeWheelListener(elem, callback, isPassiveListener) {
    _removeWheelListener(elem, getSupport(), callback, isPassiveListener);

    // handle MozMousePixelScroll in older Firefox
    if (getSupport() == "DOMMouseScroll") {
      _removeWheelListener(
        elem,
        "MozMousePixelScroll",
        callback,
        isPassiveListener
      );
    }
  }

  return {
    on: addWheelListener,
    off: removeWheelListener
  };
})();

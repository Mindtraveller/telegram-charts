let d = document;

function el(elementName, ...classNames) {
    return addClass(d.createElement(elementName), ...classNames);
}

function t(text) {
    return d.createTextNode(text);
}

function svgEl(elementName, attributes, ...classNames) {
    let element = d.createElementNS('http://www.w3.org/2000/svg', elementName);
    svgAttrs(element, attributes);
    return addClass(element, ...classNames);
}

function svgAttrs(element, attributes = {}) {
    Object.entries(attributes).forEach(([attributes, value]) => {
        element.setAttributeNS(null, attributes, value);
    });
}

function addClass(element, ...className) {
    element.classList.add(...(className.filter(_ => _)));
    return element;
}

function removeClass(element, ...className) {
    element.classList.remove(...(className.filter(_ => _)));
}

function add(parent, ...children) {
    children.filter(node => !!node).forEach(child => parent.appendChild(child));
}

function on(element, eventName, callback) {
    element.addEventListener(eventName, callback);
}

function off(element, eventName, callback) {
    element.removeEventListener(eventName, callback);
}

function emit(element, eventName, data) {
    element.dispatchEvent(new CustomEvent(eventName, { detail: data }));
}

function applyAnimation(element, animationName, duration = 250) {
  element.style.animationName = animationName
  setTimeout(() => {
    element.style.animationName = null
  }, duration)
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

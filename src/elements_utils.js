const d = document;

function el(elementName) {
    return d.createElement(elementName);
}

function t(text) {
    return d.createTextNode(text);
}

function svgEl(elementName, attributes) {
    const element = d.createElementNS('http://www.w3.org/2000/svg', elementName);
    svgAttrs(element, attributes);
    return element;
}

function svgAttrs(element, attributes = {}) {
    Object.entries(attributes).forEach(([attributes, value]) => {
        element.setAttributeNS(null, attributes, value);
    });
}

function addClass(element, ...className) {
    element.classList.add(...className);
    return element;
}

function removeClass(element, ...className) {
    element.classList.remove(...className);
}

function add(parent, child) {
    parent.appendChild(child);
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
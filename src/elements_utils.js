const SVG_NS = 'http://www.w3.org/2000/svg'

function createElement(elementName) {
    return document.createElement(elementName);
}

function createText(text) {
    return document.createTextNode(text);
}

function createSVGElement(elementName) {
    return document.createElementNS(SVG_NS, elementName);
}

function setSVGAttr(element, propertyName, value) {
    element.setAttributeNS(null, propertyName, value);
}

function addClass(element, ...className) {
    element.classList.add(...className);
}

function removeClass(element, ...className) {
    element.classList.remove(...className);
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
function createSlider(x, containerElement) {
    let MIN_WIDTH = 50;

    let { slider, leftBar, rightBar } = createSlider();
    let leftShadow = el('div', 'shadow', 'left');
    let rightShadow = el('div', 'shadow', 'right');

    on(containerElement, 'mousedown', handleTouchStart);
    on(containerElement, 'touchstart', handleTouchStart);

    let TOTAL_WIDTH;
    let RIGHT_BORDER = 0;
    let NEXT_RIGHT_BORDER = 0;
    let LEFT_BORDER;
    let NEXT_LEFT_BORDER;
    let recentEmittedBorders = { start: -1, end: -1 };

    let touchStartX;

    requestAnimationFrame(() => {
        TOTAL_WIDTH = slider.parentElement.getBoundingClientRect().width;
        NEXT_LEFT_BORDER = TOTAL_WIDTH - MIN_WIDTH;
        moveRightBorder(NEXT_RIGHT_BORDER);
        moveLeftBorder(NEXT_LEFT_BORDER);
        persistBorders();
        emitBorderChange();
    });

    function handleTouchStart(event) {
        let target = event.target;
        let moveHandler = target === slider
            ? handleSliderMove
            : target === leftBar || target === rightBar
                ? moveEvent => handleBarMove(moveEvent, target === leftBar)
                : undefined;

        if (!moveHandler) {
            return;
        }

        touchStartX = getX(event);

        let endHandler = () => {
            persistBorders();
            off(containerElement, 'mousemove', moveHandler);
            off(containerElement, 'touchmove', moveHandler);
            off(d, 'mouseup', endHandler);
            off(d, 'touchend', endHandler);
        }

        on(containerElement, 'mousemove', moveHandler);
        on(containerElement, 'touchmove', moveHandler);
        on(d, 'mouseup', endHandler);
        on(d, 'touchend', endHandler);
    }

    function handleSliderMove(event) {
        event.preventDefault();
        let newX = getX(event);
        let diff = touchStartX - newX;
        let newLeftBorder = LEFT_BORDER - diff;
        let newRightBorder = RIGHT_BORDER + diff;

        if (canMoveBorders(newLeftBorder, newRightBorder)) {
            moveLeftBorder(newLeftBorder);
            moveRightBorder(newRightBorder);
            emitBorderChange();
        }
    }

    function handleBarMove(event, isLeft) {
        event.preventDefault();
        let newX = getX(event);
        let diff = touchStartX - newX
        let newLeftBorder = isLeft ? Math.max(0, LEFT_BORDER - diff) : NEXT_LEFT_BORDER;
        let newRightBorder = isLeft ? NEXT_RIGHT_BORDER : Math.max(0, RIGHT_BORDER + diff);

        if (canMoveBorders(newLeftBorder, newRightBorder)) {
            isLeft ? moveLeftBorder(newLeftBorder) : moveRightBorder(newRightBorder);
            emitBorderChange();
        }
    }

    function persistBorders() {
        if (canMoveBorders(NEXT_LEFT_BORDER, NEXT_RIGHT_BORDER)) {
            LEFT_BORDER = NEXT_LEFT_BORDER;
            RIGHT_BORDER = NEXT_RIGHT_BORDER;
        }
    }

    function getX(event) {
        return event.touches ? event.touches[0].clientX : event.clientX;
    }

    function canMoveBorders(left, right) {
        return left >= 0 && right >= 0 && TOTAL_WIDTH - left - right >= MIN_WIDTH;
    }

    function moveLeftBorder(width) {
        NEXT_LEFT_BORDER = width
        setWidth(leftShadow, width);
    }

    function moveRightBorder(width) {
        NEXT_RIGHT_BORDER = width
        setWidth(rightShadow, width);
    }

    function setWidth(element, width) {
        element.style.width = `${width}px`;
    }

    function emitBorderChange() {
        let borders = {
            start: Math.max(0, Math.round(NEXT_LEFT_BORDER * x.length / TOTAL_WIDTH)),
            end: Math.min(x.length - 1, Math.round((TOTAL_WIDTH - NEXT_RIGHT_BORDER) * (x.length - 1) / TOTAL_WIDTH)),
        }

        if (recentEmittedBorders.start === borders.start && recentEmittedBorders.end === borders.end) {
            return
        }

        recentEmittedBorders = borders;
        emit(containerElement, 'border-changed', borders);
    }

    function createSlider() {
        let slider = el('div', 'slider');
        let leftBar = el('div', 'slider__bar');
        let rightBar = el('div', 'slider__bar', 'right');
        add(slider, leftBar, rightBar);
        return { slider, leftBar, rightBar };
    }

    let sliderContainer = el('div', 'slider-container');
    add(sliderContainer, leftShadow, slider, rightShadow);
    return sliderContainer;
}

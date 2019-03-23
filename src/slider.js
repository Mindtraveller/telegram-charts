function createSlider(chart, containerElement) {
    const MIN_WIDTH = 50;

    const x = chart.columns[0].slice(1);
    const { slider, leftBar, rightBar } = createSlider();
    const leftShadow = addClass(el('div'), 'shadow', 'left');
    const rightShadow = addClass(el('div'), 'shadow', 'right');

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
        const moveHandler = target === slider
            ? handleSliderMove
            : target === leftBar || target === rightBar
                ? moveEvent => handleBarMove(moveEvent, target === leftBar)
                : undefined;

        if (!moveHandler) {
            return;
        }

        touchStartX = getX(event);

        const endHandler = () => {
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
        const newX = getX(event);
        const diff = touchStartX - newX;
        const newLeftBorder = LEFT_BORDER - diff;
        const newRightBorder = RIGHT_BORDER + diff;

        if (canMoveBorders(newLeftBorder, newRightBorder)) {
            moveLeftBorder(newLeftBorder);
            moveRightBorder(newRightBorder);
            emitBorderChange();
        }
    }

    function handleBarMove(event, isLeft) {
        event.preventDefault();
        const newX = getX(event);
        const diff = touchStartX - newX
        const newLeftBorder = isLeft ? Math.max(0, LEFT_BORDER - diff) : NEXT_LEFT_BORDER;
        const newRightBorder = isLeft ? NEXT_RIGHT_BORDER : Math.max(0, RIGHT_BORDER + diff);

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
        const borders = {
            start: Math.max(0, Math.floor(NEXT_LEFT_BORDER * x.length / TOTAL_WIDTH)),
            end: Math.min(x.length - 1, Math.round((TOTAL_WIDTH - NEXT_RIGHT_BORDER) * x.length / TOTAL_WIDTH)),
        }

        if (recentEmittedBorders.start === borders.start && recentEmittedBorders.end === borders.end) {
            return
        }

        recentEmittedBorders = borders;
        emit(containerElement, 'border-changed', borders);
    }

    function createSlider() {
        const slider = addClass(el('div'), 'slider');
        const leftBar = addClass(el('div'), 'slider__bar');
        const rightBar = addClass(el('div'), 'slider__bar', 'right');
        add(slider, leftBar);
        add(slider, rightBar);
        return { slider, leftBar, rightBar };
    }

    const sliderContainer = addClass(el('div'), 'slider-container');
    add(sliderContainer, leftShadow);
    add(sliderContainer, slider);
    add(sliderContainer, rightShadow);
    return sliderContainer;
}

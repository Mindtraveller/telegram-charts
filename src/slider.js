const MIN_WIDTH = 50;

function createSlider(chart, containerElement) {
    const x = chart.columns[0].slice(1);
    const { slider, leftBar, rightBar } = createSlider();
    const leftShadow = createShadowElement('left');
    const rightShadow = createShadowElement('right');

    on(leftBar, 'touchstart', handleBarTouchStart);
    on(leftBar, 'mousedown', handleBarTouchStart);
    on(slider, 'touchstart', handleSliderTouchStart);
    on(slider, 'mousedown', handleSliderTouchStart);
    on(rightBar, 'touchstart', handleBarTouchStart);
    on(rightBar, 'mousedown', handleBarTouchStart);

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
    })

    function handleSliderTouchStart(event) {
        touchStartX = event.touches ? event.touches[0].clientX : event.clientX;
        on(event.target, 'touchmove', handleSliderMove);
        on(event.target.parentElement, 'mousemove', handleSliderMove);
        on(event.target, 'touchend', handleSliderEnd);
        window.onmouseup = () => handleSliderEnd(event);
    }

    function handleSliderMove(event) {
        event.preventDefault();
        const newX = event.touches ? event.touches[0].clientX : event.clientX;
        const diff = touchStartX - newX;
        const newLeftBorder = Math.max(0, LEFT_BORDER - diff);
        const newRightBorder = Math.max(0, RIGHT_BORDER + diff);

        if (canMoveBorders(newLeftBorder, newRightBorder)) {
            moveLeftBorder(newLeftBorder);
            moveRightBorder(newRightBorder);
            emitBorderChange();
        }
    }

    function handleSliderEnd(event) {
        persistBorders();
        off(event.target, 'touchmove', handleSliderMove);
        off(event.target.parentElement, 'mousemove', handleSliderMove);
        off(event.target, 'touchend', handleSliderEnd);
        window.onmouseup = undefined;
    }

    function handleBarTouchStart(event) {
        touchStartX = event.touches ? event.touches[0].clientX : event.clientX;
        const isLeft = event.target === leftBar
        event.target.ontouchmove = touchMove => handleBarMove(touchMove, isLeft);
        event.target.parentElement.parentElement.onmousemove = moveEvent => handleBarMove(moveEvent, isLeft);
        on(event.target, 'touchend', handleBarTouchEnd);
        window.onmouseup = () => handleBarTouchEnd(event);
        event.stopPropagation();
    }

    function handleBarMove(event, isLeft) {
        event.preventDefault();
        const newX = event.touches ? event.touches[0].clientX : event.clientX;
        const diff = touchStartX - newX
        const newLeftBorder = isLeft ? Math.max(0, LEFT_BORDER - diff) : NEXT_LEFT_BORDER;
        const newRightBorder = isLeft ? NEXT_RIGHT_BORDER : Math.max(0, RIGHT_BORDER + diff);

        if (canMoveBorders(newLeftBorder, newRightBorder)) {
            isLeft ? moveLeftBorder(newLeftBorder) : moveRightBorder(newRightBorder);
            emitBorderChange();
        }
    }

    function handleBarTouchEnd(event) {
        persistBorders();
        event.target.onmousemove = undefined
        event.target.parentElement.parentElement.onmousemove = undefined;
        off(event.target, 'touchend', handleBarTouchEnd);
        window.onmouseup = undefined
    }

    function persistBorders() {
        if (canMoveBorders()) {
            RIGHT_BORDER = NEXT_RIGHT_BORDER;
            LEFT_BORDER = NEXT_LEFT_BORDER;
        }
    }

    function canMoveBorders(left = NEXT_LEFT_BORDER, right = NEXT_RIGHT_BORDER) {
        return TOTAL_WIDTH - left - right >= MIN_WIDTH;
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

    function createShadowElement(className) {
        return addClass(el('div'), 'shadow', className);
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

function createButtons(chartData, chartRootElement) {
  let LONG_TOUCH_DURATION = 300
  let longTouchTimeout = null

  let buttons = el('div', 'buttons');
  on(buttons, isTouchDevice() ? 'touchstart' : 'mousedown', handleTouchStart)

  let visibilityMap = Object.keys(chartData.names).reduce((acc, chartName) => ({
    ...acc,
    [chartName]: true,
  }), {});

  Object.keys(chartData.names).forEach(chart => {
    let button = el('button');
    let div = el('div');
    add(button, div);
    const buttonColor = BUTTON_COLORS[chartData.colors[chart]];
    button.style.borderColor = buttonColor
    div.style.background = buttonColor
    let icon = svgEl('svg', { width: '18', height: '18', viewBox: '0 0 24 24' });
    add(icon, svgEl('path', { d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' }));
    let span = el('span');
    span.style.color = buttonColor
    add(span, t(chartData.names[chart]));
    add(button, icon, span);
    button.dataset.chart = chart;
    add(buttons, button);
  });

  function handleTouchStart(event) {
    let chartToggled = event.target.dataset.chart
    if (!chartToggled) {
      return
    }

    on(buttons, isTouchDevice() ? 'touchend' : 'mouseup', handleTouchEnd)

    longTouchTimeout = setTimeout(() => {
      handleLongTouch(chartToggled)
    }, LONG_TOUCH_DURATION)
  }

  function handleTouchEnd(event) {
    off(buttons, isTouchDevice() ? 'touchend' : 'mouseup', handleTouchEnd)

    if (longTouchTimeout) {
      clearTimeout(longTouchTimeout)
      longTouchTimeout = null
      handleButtonClick(event)
    }
  }

  function handleLongTouch(chartToggled) {
    longTouchTimeout = null

    visibilityMap = {
      [chartToggled]: true,
    };

    [...buttons.childNodes].forEach(button =>
      !visibilityMap[button.dataset.chart] ? addClass(button, 'm-hidden') : removeClass(button, 'm-hidden')
    )

    emit(chartRootElement, 'visibility-updated', visibilityMap)
  }

  function handleButtonClick(event) {
    let button = event.target
    let chartToggled = button.dataset.chart
    if (!chartToggled) {
      return;
    }

    let newVisibilityMap = {
      ...visibilityMap,
      [chartToggled]: !visibilityMap[chartToggled],
    };

    // do not allow to hide all charts
    if (!Object.values(newVisibilityMap).some(value => value)) {
      applyAnimation(button, 'shake', 800)
      return
    }

    event.target.classList.toggle('m-hidden');
    visibilityMap = newVisibilityMap
    emit(chartRootElement, 'visibility-updated', visibilityMap);
  }

  return {
    buttons,
    visibilityMap
  };
}

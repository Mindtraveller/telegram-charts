function createButtons(chartData, chartRootElement) {
    let buttons = el('div', 'buttons');
    on(buttons, 'click', handleButtonClick);

    let visibilityMap = Object.keys(chartData.names).reduce((acc, chartName) => ({
        ...acc,
        [chartName]: true,
    }), {});

    Object.keys(chartData.names).forEach(chart => {
        let button = el('button');
        let div = el('div');
        add(button, div);
        button.style.borderColor = chartData.colors[chart];
        div.style.background = chartData.colors[chart];
        let icon = svgEl('svg', { width: '18', height: '18', viewBox: '0 0 24 24' });
        add(icon, svgEl('path', { d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' }));
        let span = el('span');
        span.style.color = chartData.colors[chart];
        add(span, t(chartData.names[chart]));
        add(button, icon, span);
        button.dataset.chart = chart;
        add(buttons, button);
    });

    function handleButtonClick(event) {
        let chartToggled = event.target.dataset.chart;
        if (!chartToggled) {
            return;
        }

        let newVisibilityMap = {
            ...visibilityMap,
            [chartToggled]: !visibilityMap[chartToggled],
        };

        // do not allow to hide all charts
        if (!Object.values(newVisibilityMap).some(value => value)) {
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

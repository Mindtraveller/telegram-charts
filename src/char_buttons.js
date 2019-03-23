function createButtons(chartData, chartRootElement) {
    let buttons = addClass(el('div'), 'buttons');
    on(buttons, 'click', handleButtonClick);

    let visibilityMap = Object.keys(chartData.names).reduce((acc, chartName) => ({
        ...acc,
        [chartName]: true,
    }), {});

    Object.keys(chartData.names).forEach(chart => {
        let button = el('button');
        let icon = svgEl('svg', { width: '20', height: '20', viewBox: '0 0 24 24' });
        icon.style.borderColor = chartData.colors[chart];
        icon.style.background = chartData.colors[chart];
        let iconPath = svgEl('path', { d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' });
        add(icon, iconPath);
        add(button, icon);
        let span = el('span');
        add(span, t(chartData.names[chart]));
        add(button, span);
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

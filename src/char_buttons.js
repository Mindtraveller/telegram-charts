function createButtons(chart, chartRootElement) {
    const buttons = createElement('div');
    addClass(buttons, 'buttons');
    on(buttons, 'click', handleButtonClick);

    let visibilityMap = Object.keys(chart.names).reduce((acc, chartName) => ({
        ...acc,
        [chartName]: true
    }), {});

    showChartButtons(chart);

    function showChartButtons(chartData) {
        Object.keys(chartData.names).forEach(chart => {
            const button = createElement('button');
            const icon = createSVGElement('svg');
            setSVGAttr(icon, 'width', '24');
            setSVGAttr(icon, 'height', '24');
            setSVGAttr(icon, 'viewBox', '0 0 24 24');
            icon.style.borderColor = chartData.colors[chart];
            icon.style.background = chartData.colors[chart];
            const iconPath = createSVGElement('path');
            setSVGAttr(iconPath, 'd', 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z');
            icon.appendChild(iconPath);
            button.appendChild(icon);
            const text = document.createTextNode(chartData.names[chart]);
            const span = createElement('span');
            span.appendChild(text);
            button.appendChild(span);
            button.dataset.chart = chart;
            buttons.appendChild(button);
        })
    }

    function handleButtonClick(event) {
        const chartToggled = event.target.dataset.chart;
        if (!chartToggled) {
            return;
        }
        const newVisibilityMap = {
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

function createChart(data, index) {
    let chartsContainer = d.getElementById('charts-container');
    let chartRootElement = el('div', 'chart-wrapper')

    let title = el('h1')
    add(title, t('Chart #' + index))
    add(chartRootElement, title)

    if (data.y_scaled) {
        createDoubleYLineChart(chartRootElement, data)
    } else {
        createLineChart(chartRootElement, data)
    }

    add(chartsContainer, chartRootElement)
}

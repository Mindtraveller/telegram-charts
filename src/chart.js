function createChart(data, index) {
  let chartsContainer = d.getElementById('charts-container');
  let chartRootElement = el('div', 'chart-wrapper')

  let info = el('div', 'chart-info')
  let title = el('h1')
  let selectedRange = el('div', 'selected-range')
  let from = el('span', 'range-from')
  let to = el('span', 'range-to')
  add(selectedRange, from, t(' - '), to)
  add(title, t('Chart #' + index))
  add(info, title, selectedRange)
  add(chartRootElement, info)

  if (data.y_scaled) {
    createDoubleYLineChart(chartRootElement, data)
  } else if (data.types.y0 === 'bar') {
    createBarChart(chartRootElement, data)
  } else {
    createLineChart(chartRootElement, data)
  }

  add(chartsContainer, chartRootElement)

  let x = data.columns[0].slice(1)
  on(chartRootElement, 'border-changed', ({ detail: { start, end } }) => {
    from.textContent = formatDate(x[start])
    to.textContent = formatDate(x[end])
  })

  function formatDate(timestamp) {
    let date = new Date(timestamp)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }
}

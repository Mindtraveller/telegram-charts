function createChart(data, index) {
  let chartsContainer = d.getElementById('charts-container');
  let chartRootElement = el('div', 'chart-wrapper')

  let info = el('div', 'chart-info')
  let title = el('h1')
  let selectedRange = el('div', 'selected-range')
  let from = el('div', 'range-from')
  let to = el('span', 'range-to')
  add(selectedRange, from, t(' - '), to)
  add(title, t('Chart #' + index))
  add(info, title, selectedRange)
  add(chartRootElement, info)

  if (data.y_scaled) {
    createDoubleYLineChart(chartRootElement, data)
  } else if (data.types.y0 === 'bar') {
    createBarChart(chartRootElement, data)
  } else if (data.types.y0 === 'area') {
    createPercentageStackedAreaChart(chartRootElement, data)
  } else {
    createLineChart(chartRootElement, data)
  }

  add(chartsContainer, chartRootElement)

  let ANIMATION_TIME = 250
  let animationTimeout = null
  let x = data.columns[0].slice(1)
  let prevStart = -1
  let prevEnd = -1
  let newStart = -1
  let newEnd = -1

  on(chartRootElement, 'border-changed', ({ detail: { start, end } }) => {
    newStart = start
    newEnd = end

    if (!animationTimeout) {
      animationTimeout = setTimeout(() => {
        animationTimeout = null

        if (newStart !== prevStart) {
          prevStart = newStart
          from.textContent = formatDate(x[prevStart])
          applyAnimation(from, 'time-change')
        }

        if (newEnd !== prevEnd) {
          prevEnd = newEnd
          to.textContent = formatDate(x[prevEnd])
          applyAnimation(to, 'time-change')
        }
      }, ANIMATION_TIME)
    }
  })

  function formatDate(timestamp) {
    let date = new Date(timestamp)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }
}

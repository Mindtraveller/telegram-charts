function createCanvas(width, height) {
  let canvas = el('canvas')
  canvas.width = width
  canvas.height = height
  let context = canvas.getContext('2d')
  context.setTransform(1, 0, 0, -1, 0, height)
  return { canvas, context }
}

function clearCanvas(canvas) {
  canvas.context.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height)
}

function drawLine(canvas, x, y, color, alpha = 1, width = 1) {
  canvas.context.beginPath()
  canvas.context.globalAlpha = alpha
  canvas.context.strokeStyle = color
  canvas.context.lineWidth = width
  canvas.context.moveTo(x[0], y[0])
  for (let i = 1; i < x.length; i++) {
    canvas.context.lineTo(x[i], y[i])
  }
  canvas.context.stroke()
}

function drawBars(canvas, x, y, color, width, alpha = 1) {
  canvas.context.beginPath()
  width = Math.ceil(width)
  canvas.context.fillStyle = color
  canvas.context.globalAlpha = alpha
  canvas.context.moveTo(x[0], 0)
  canvas.context.lineTo(x[x.length - 1] + width, 0)
  for (let i = x.length - 1; i >= 0; i--) {
    let _y = Math.round(y[i])
    canvas.context.lineTo(x[i] + width, _y);
    canvas.context.lineTo(x[i - 1] ? x[i - 1] + width : x[i], _y);
  }
  canvas.context.fill()
}

function drawStackedArea(canvas, x, y, color) {
  canvas.context.beginPath()
  canvas.context.fillStyle = color
  canvas.context.moveTo(x[0], y[0])
  for (let i = 1; i < x.length; i++) {
    canvas.context.lineTo(x[i], y[i * 2])
  }
  for (let i = x.length - 1; i >= 0; i--) {
    canvas.context.lineTo(x[i], y[i * 2 + 1])
  }
  canvas.context.fill()
}

function drawStackedBars(canvas, x, y, color, width, alpha = 1) {
  canvas.context.beginPath()
  width = Math.ceil(width)
  canvas.context.fillStyle = color
  canvas.context.globalAlpha = alpha
  canvas.context.moveTo(x[0], y[0])
  canvas.context.lineTo(x[0] + width, y[0])
  for (let i = 1; i < x.length; i++) {
    canvas.context.lineTo(x[i - 1] ? x[i - 1] + width : x[i], y[i * 2]);
    canvas.context.lineTo(x[i] + width, y[i * 2]);
  }
  for (let i = x.length - 1; i >= 0; i--) {
    canvas.context.lineTo(x[i] + width, y[i*2] + y[i * 2 + 1]);
    canvas.context.lineTo(x[i - 1] ? x[i - 1] + width : x[i], y[i*2] + y[i * 2 + 1]);
  }
  canvas.context.fill()
}

function createSelectedPointInfo(chartData, hasTotal) {
  let info = el('div', 'point-info')
  let chartInfoContainer = el('div', 'charts-info')
  let date = el('div')
  let dOW = el('div')
  let month = el('div')
  let day = el('div')
  let year = el('div')
  add(date, dOW, t(','), day, month, year)
  add(info, date, chartInfoContainer)

  let chartValues = Object.entries(chartData.names).reduce((acc, [chart, chartName]) => {
    let div = el('div', 'info')
    let value = el('span')
    let subValue = el('span')
    let name = el('span', 'name')
    add(name, t(chartName))
    add(div, subValue, name, value)
    add(chartInfoContainer, div)
    acc[chart] = { value, subValue }
    return acc
  }, {})

  let value;
  if (hasTotal) {
    let div = el('div', 'info')
    let subValue = el('span')
    value = el('span')
    let name = el('span', 'name')
    add(name, t('All'))
    add(div, subValue, name, value)
    add(chartInfoContainer, div)
  }

  return { selectedPointInfo: info, pointChartValues: chartValues, pointDate: { dOW, month, day, year }, total: { value } }
}

function createAxisLine(x1, x2, y1, y2) {
  return svgEl('line', { x1, y1, x2, y2, 'stroke-width': 1 })
}

let xLabelDateFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' })

function toXLabel(timestamp) {
  return xLabelDateFormat.format(new Date(timestamp))
}

let selectedPointDateFormat = new Intl.DateTimeFormat('en-GB', { month: 'short', weekday: 'short' })

function formatSelectedPointData(timestamp) {
  let date = new Date(timestamp)
  let formattedDate = selectedPointDateFormat.format(date)
  return { month: formattedDate.slice(-4, -1), year: date.getFullYear(), day: date.getDate(), dOW: formattedDate.slice(0, 3) }
}

function setSelectedPointDate(xValue, pointDate) {
  let date = formatSelectedPointData(xValue)
  if (date.year !== +pointDate.year.textContent) {
    pointDate.year.textContent = date.year
    applyAnimation(pointDate.year, 'date-change')
  }

  if (date.month !== pointDate.month.textContent) {
    pointDate.month.textContent = date.month
    applyAnimation(pointDate.month, 'date-change')
  }

  if (date.day !== +pointDate.day.textContent) {
    pointDate.day.textContent = date.day
    applyAnimation(pointDate.day, 'date-change')
  }

  if (date.dOW !== pointDate.dOW.textContent) {
    pointDate.dOW.textContent = date.dOW
    applyAnimation(pointDate.dOW, 'date-change')
  }
}

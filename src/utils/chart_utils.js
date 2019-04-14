function createCanvas(width, height) {
  let canvas = el('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').setTransform(1, 0, 0, -1, 0, height)
  return canvas
}

function clearCanvas(canvas) {
  let context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
}

function drawLine(canvas, x, y, color, alpha = 1, width = 1) {
  let context = canvas.getContext('2d')
  context.beginPath()
  context.globalAlpha = alpha
  context.strokeStyle = color
  context.lineWidth = width
  context.moveTo(Math.round(x[0]), Math.round(y[0]))
  for (let i = 1; i < x.length; i++) {
    context.lineTo(Math.round(x[i]), Math.round(y[i]))
  }
  context.stroke()
}

function drawBars(canvas, x, y, color, width) {
  let context = canvas.getContext('2d')
  context.beginPath()
  context.fillStyle = color
  for (let i = 0; i < x.length; i++) {
    context.rect(x[i], 0, Math.ceil(width), Math.round(y[i]));
  }
  context.fill()
}

function drawStackedArea(canvas, x, y, color) {
  let context = canvas.getContext('2d') // TODO: pass context as param
  context.beginPath()
  context.fillStyle = color
  context.strokeStyle = color
  context.lineWidth = 1
  context.moveTo(Math.round(x[0]), Math.floor(y[0]))
  for (let i = 1; i < x.length; i++) {
    context.lineTo(Math.round(x[i]), Math.floor(y[i * 2]))
  }
  for (let i = x.length - 1; i >= 0; i--) {
    context.lineTo(Math.round(x[i]), Math.ceil(y[i * 2 + 1]))
  }
  context.fill()
}

function drawStackedBars(canvas, x, y, color, width, alpha = 1) {
  let context = canvas.getContext('2d')
  context.beginPath()
  width = Math.ceil(width)
  context.fillStyle = color
  context.globalAlpha = alpha
  for (let i = 0; i < x.length; i++) {
    context.rect(x[i], y[i * 2], width, y[i * 2 + 1]);
  }
  context.fill()
}

function createSelectedPointInfo(chartData, hasTotal) {
  let info = el('div', 'point-info')
  let chartInfoContainer = el('div', 'charts-info')
  let date = el('div')
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

  return { selectedPointInfo: info, pointChartValues: chartValues, pointDate: date, total: { value } }
}

function createAxisLine(x1, x2, y1, y2) {
  return svgEl('line', { x1, y1, x2, y2, 'stroke-width': 1 })
}

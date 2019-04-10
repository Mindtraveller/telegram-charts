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

function createSelectedPointInfo(chartData) {
  let info = el('div', 'point-info')
  let chartInfoContainer = el('div', 'charts-info')
  let date = el('div')
  add(info, date, chartInfoContainer)
  let chartValues = Object.entries(chartData.names).reduce((acc, [chart, chartName]) => {
    let div = el('div', 'info')
    let value = el('span')
    value.style.color = TOOLTIP_COLORS[chartData.colors[chart]]
    acc[chart] = value
    add(div, t(chartName), value)
    add(chartInfoContainer, div)
    return acc
  }, {})

  return { selectedPointInfo: info, pointChartValues: chartValues, pointDate: date }
}

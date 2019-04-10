function createBarChart(chartRootElement, data) {
  let MAX_CHART_WIDTH = 400
  let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth) // same width for preview as well
  let CHART_HEIGHT = 350
  let PREVIEW_WIDTH = CHART_WIDTH - 20
  let PREVIEW_HEIGHT = 50

  let ANIMATION_TIME = 250

  let X_AXIS_PADDING = 20

  let NUMBER_Y_AXES = 6

  let ZOOM_STEP = 10 * CHART_WIDTH / MAX_CHART_WIDTH
  let X_LABELS_MAX_NUMBER = 6 // desired number, not concrete one :)

  let x = data.columns[0].slice(1)
  let chartData = {
    ...data,
    columns: data.columns.slice(1).map(column => ({ name: column[0], data: column.slice(1) })),
    lines: {},
  }

  let X_LABELS_STEP = Math.round(x.length / ZOOM_STEP / X_LABELS_MAX_NUMBER)

  let chartSVG = createChartElement()
  let chart = createCanvas(CHART_WIDTH, CHART_HEIGHT)
  let { preview, previewContainer } = createPreview()
  let { selectedPointInfo, pointChartValues, pointDate } = createSelectedPointInfo(chartData)
  let { xAxes, xAxesHidden } = createXAxes()
  let { yAxesGroupShown, yAxesGroupHidden } = createYAxes()

  let chartContainer = el('div', 'charts')

  add(chartContainer, chart, chartSVG, previewContainer, selectedPointInfo)
  add(chartSVG, createYLines(), yAxesGroupShown, yAxesGroupHidden, xAxes, xAxesHidden)

  add(chartRootElement, chartContainer)

  let start = 0
  let end = x.length
  let selectedXIndex = -1

  let yMax = 0
  let columnsToShow = chartData.columns

  let xCoordinates = buildXCoordinates()
  let xPreviewCoordinates = normalizeX(x, CHART_WIDTH)

  let newYMax = calculateYMax(columnsToShow)
  let newPreviewYMax = calculatePreviewYMax(columnsToShow)

  let zoom = calculateZoom(start, end)
  let xLabels = buildXLabels(zoom)

  let yAxesUpdateTimeout = null

  createChartLines()

  displayData(true)
  displayYAxes(yMax, newYMax)

  yMax = newYMax

  on(chartRootElement, 'border-changed', ({ detail: { start: newStart, end: newEnd } }) => {
    let newZoom = calculateZoom(newStart, newEnd)

    if (newZoom !== zoom) {
      xLabels = buildXLabels(newZoom)
      animateXLabels(zoom, newZoom, start, newStart, end, newEnd)
      zoom = newZoom
    }

    clearCanvas(chart)

    start = newStart
    end = newEnd
    xCoordinates = buildXCoordinates()

    newYMax = calculateYMax(columnsToShow)
    displayData()

    if (!yAxesUpdateTimeout) {
      let _yMax = yMax
      yAxesUpdateTimeout = setTimeout(() => {
        displayYAxes(_yMax, newYMax)
        yAxesUpdateTimeout = null
      }, ANIMATION_TIME)
    }

    yMax = newYMax

    displayXAxes()
    displaySelectedPoint()
  })

  on(chartSVG, 'click', event => {
    let step = CHART_WIDTH / xCoordinates.length
    let newIndex = start + Math.max(0, xCoordinates.findIndex(xCoordinate => xCoordinate + step > event.offsetX))
    if (newIndex !== selectedXIndex) {
      selectedXIndex = newIndex

      clearCanvas(chart)
      displayData()
      displaySelectedPoint()
    }
  })

  on(d, 'click', event => {
    if (!chartRootElement.contains(event.target)) {
      selectedXIndex = -1

      clearCanvas(chart)
      displayData()
      displaySelectedPoint()
    }
  })

  function displayYAxes(yMax, newYMax) {
    if (newYMax === yMax) {
      return
    }

    let axisStep = Math.ceil(newYMax / NUMBER_Y_AXES)
    let axes = Array.apply(null, Array(NUMBER_Y_AXES)).map((_, i) => i * axisStep)
    let normalizedAxes = customNormalize(axes, newYMax, CHART_HEIGHT)

    let elements = yAxesGroupHidden.childNodes
    normalizedAxes.reverse().forEach((y, i) => {
      let text = elements[i]
      text.textContent = axes[axes.length - i - 1]
      svgAttrs(text, { x: 5, y: CHART_HEIGHT - y - 5 /** place text a bit above the line */ })
    })

    removeClass(yAxesGroupHidden, 'm-down', 'm-up')
    removeClass(yAxesGroupShown, 'm-down', 'm-up')
    addClass(yAxesGroupHidden, newYMax > yMax ? 'm-up' : 'm-down', 'pending')
    addClass(yAxesGroupShown, newYMax > yMax ? 'm-down' : 'm-up', 'pending')

    let _ = yAxesGroupHidden
    yAxesGroupHidden = yAxesGroupShown
    yAxesGroupShown = _

    // proper position will be set without animation and only then animation will start
    setTimeout(() => {
      removeClass(yAxesGroupShown, 'hidden', 'pending')
      removeClass(yAxesGroupHidden, 'pending')
      addClass(yAxesGroupHidden, 'hidden')
    }, 0)
  }

  function displayXAxes() {
    clearChildren(xAxes)

    let step = getXLabelsStep(zoom)
    let firstLabelCoordinateIndex = 1 // do not pick the first item for nice indents from the chart borders
    while ((start + firstLabelCoordinateIndex) % step !== 0) {
      firstLabelCoordinateIndex++
    }

    // always insert label the will be there when zoom doubles as first label
    if ((start + firstLabelCoordinateIndex) % (step * 2) !== 0) {
      let firstLabelX = (start + firstLabelCoordinateIndex - step) / (step * 2)
      let xCoordinate = CHART_WIDTH * (x[firstLabelX] - x[start]) / (x[end] - x[start])
      let label = createSVGText(xLabels[firstLabelX], xCoordinate, CHART_HEIGHT + X_AXIS_PADDING - 5)
      add(xAxes, label)
    }

    for (let i = firstLabelCoordinateIndex; i < xCoordinates.length - 1; i += step) {
      let label = createSVGText(xLabels[(start + i) / step], xCoordinates[i], CHART_HEIGHT + X_AXIS_PADDING - 5)
      add(xAxes, label)
    }
  }

  function animateXLabels(zoom, newZoom, oldStart, newStart, oldEnd, newEnd) {
    let startMoved = oldStart !== newStart
    let endMoved = oldEnd !== newEnd

    if (!(startMoved && endMoved)) {
      let _ = xAxes
      xAxes = xAxesHidden
      xAxesHidden = _

      addClass(xAxes, 'pending', endMoved ? 'right' : '', newZoom > zoom ? 'even' : '')
      removeClass(xAxes, endMoved ? '' : 'right', newZoom > zoom ? '' : 'even')
      addClass(xAxesHidden, endMoved ? 'right' : '')
      removeClass(xAxesHidden, 'even', newZoom > zoom ? 'pending' : '', endMoved ? '' : 'right')
      setTimeout(() => {
        removeClass(xAxes, 'hidden')
        addClass(xAxesHidden, 'hidden')
      }, 0)
    }
  }

  function displaySelectedPoint() {
    if (selectedXIndex === -1 || selectedXIndex < start || selectedXIndex > end) {
      selectedPointInfo.style.display = 'none'
      return
    }

    let xValue = x[selectedXIndex]
    let xCoordinate = CHART_WIDTH * (xValue - x[start]) / (x[end] - x[start])

    eachColumn(chartData.columns, (data, lineName) => {
      pointChartValues[lineName].innerText = data[selectedXIndex]
      pointChartValues[lineName].parentElement.style.display = 'flex'
    })

    pointDate.innerText = new Date(xValue).toString().slice(0, 15)
    let fromRight = xCoordinate > CHART_WIDTH / 2
    selectedPointInfo.style.transform = 'translateX(' + (fromRight ? xCoordinate - 180: xCoordinate) + 'px)'
    selectedPointInfo.style.display = 'block'
  }

  function calculatePreviewYMax(columns) {
    return getMax(columns.reduce((acc, column) => acc.concat(column.data), []))
  }

  function calculateYMax(columns) {
    return getMax(columns.reduce((acc, column) => acc.concat(column.data.slice(start, end + 1)), []))
  }

  function displayData(updatePreview = false) {
    eachColumn(columnsToShow, (data, lineName) => {
      normalizeAndDisplay(chartData.lines[lineName], data)
      updatePreview && normalizeAndDisplayPreview(chartData.lines[lineName], data)
    })
  }

  function normalizeAndDisplayPreview(lines, data, alpha) {
    let previewNormalized = customNormalize(data, newPreviewYMax, PREVIEW_HEIGHT)
    drawPreviewLine(lines, xPreviewCoordinates, previewNormalized, alpha)
  }

  function normalizeAndDisplay(lines, data) {
    let dataPart = data.slice(start, end + 1)
    let normalized = customNormalize(dataPart, newYMax, CHART_HEIGHT)
    let width = CHART_WIDTH / xCoordinates.length


    if (selectedXIndex === -1) {
      drawChartLine(lines.color, xCoordinates, normalized, width)
      return
    }

    if (selectedXIndex >= start && selectedXIndex <= end) {
      drawChartLine('#8cbef5', xCoordinates.slice(0, selectedXIndex - start), normalized.slice(0, selectedXIndex - start), width)
      drawChartLine('#8cbef5', xCoordinates.slice(selectedXIndex - start + 1), normalized.slice(selectedXIndex - start + 1), width)
      drawChartLine('#558DED', [xCoordinates[selectedXIndex - start]], [normalized[selectedXIndex - start]], width)
      return
    }

    drawChartLine('#8cbef5', xCoordinates, normalized, width)
  }

  function buildXCoordinates() {
    return normalizeX(x.slice(start, end + 1), CHART_WIDTH)
  }

  function normalizeX(data, points) {
    let min = data[0]
    let max = data[data.length - 1]
    let delta = Math.abs(max - min)
    return data.map(item => points * (item - min) / delta)
  }

  function customNormalize(data, max, points, padding = 0) {
    return data.map(item => !max ? padding : (points * item / max) + padding)
  }

  function clearChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
  }

  function drawChartLine(color, x, y, width) {
      drawBars(chart, x, y, color, width)
  }

  function drawPreviewLine(line, x, y) {
    drawBars(preview, x, y, line.color, PREVIEW_WIDTH / x.length)
  }

  function clearCharts() {
    clearCanvas(chart)
    clearCanvas(preview)
  }

  function calculateZoom(start, end) {
    let partShown = Math.round(10 * (end - start) / x.length)
    return Math.round(Math.log2(partShown)) // wow, log2 in JS
  }

  function getXLabelsStep(zoom) {
    return Math.ceil(X_LABELS_STEP * Math.pow(2, zoom))
  }

  function buildXLabels(zoom) {
    let labels = []
    let step = getXLabelsStep(zoom)
    for (let i = 0; i < x.length; i += step) {
      labels.push(toXLabel(x[i]))
    }
    return labels
  }

  function toXLabel(timestamp) {
    let label = (new Date(timestamp)).toString().slice(4, 10)
    return label[4] === '0' ? `${label.slice(0, 4)}${label[5]}` : label // remove leading zeros
  }

  function eachColumn(columns, callback) {
    columns.forEach(column => callback(column.data, column.name))
  }

  function getMax(data) {
    return Math.max(...data)
  }

  function createYAxes() {
    let yAxesGroupShown = svgEl('g', {}, 'y-axes')
    let yAxesGroupHidden = svgEl('g', {}, 'y-axes', 'hidden');

    [yAxesGroupShown, yAxesGroupHidden].forEach(group => {
      for (let i = 0; i < NUMBER_Y_AXES; i++) {
        let text = createSVGText('', 5, 0)
        add(group, text)
      }
    })

    return { yAxesGroupShown, yAxesGroupHidden }
  }

  function createYLines() {
    let lineGroup = svgEl('g', {}, 'y-axes')

    let step = Math.ceil(CHART_HEIGHT / NUMBER_Y_AXES)
    for (let i = 0; i < NUMBER_Y_AXES; i++) {
      let line = createAxisLine(10, CHART_WIDTH - 10, CHART_HEIGHT - step * i, CHART_HEIGHT - step * i)
      add(lineGroup, line)
    }

    return lineGroup
  }

  function createXAxes() {
    return { xAxes: svgEl('g', {}, 'x-axes'), xAxesHidden: svgEl('g', {}, 'x-axes', 'hidden') }
  }

  function createChartLines() {
    eachColumn(columnsToShow, (column, lineName) => {
      let color = chartData.colors[lineName]
      chartData.lines[lineName] = {
        color,
      }
    })
  }

  function createAxisLine(x1, x2, y1, y2) {
    return svgEl('line', { x1, y1, x2, y2, fill: 'gray', stroke: 'gray', 'stroke-width': .3 })
  }

  function createSVGText(text, x, y) {
    let t = svgEl('text', { x, y, 'font-size': 13 })
    t.textContent = text
    return t
  }

  function createChartElement() {
    return svgEl('svg', { viewBox: `0 0 ${CHART_WIDTH} ${CHART_HEIGHT + X_AXIS_PADDING}` })
  }

  function createPreview() {
    let container = el('div', 'preview-container')
    let chart = createCanvas(PREVIEW_WIDTH, PREVIEW_HEIGHT)
    add(container, chart, createSlider(x, chartRootElement))
    return { previewContainer: container, preview: chart }
  }
}

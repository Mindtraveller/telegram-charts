function createBarChart(chartRootElement, data) {
  let MAX_CHART_WIDTH = 400
  let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth) // same width for preview as well
  let CHART_HEIGHT = 350
  let PREVIEW_WIDTH = CHART_WIDTH - 30
  let PREVIEW_HEIGHT = 50

  let DESELECTED_ALPHA = 0.5

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

  add(chartContainer, chart.canvas, chartSVG, previewContainer, selectedPointInfo)
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
  let allXLabels = buildXLabels(zoom)
  let xLabels = allXLabels[zoom]

  let yAxesUpdateTimeout = null

  createChartLines()

  displayData(true)

  on(chartRootElement, 'border-changed', ({ detail: { start: newStart, end: newEnd } }) => {
    let newZoom = calculateZoom(newStart, newEnd)

    if (newZoom !== zoom) {
      xLabels = allXLabels[newZoom]
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
      let newIndex = -1

      if (newIndex !== selectedXIndex) {
        selectedXIndex = newIndex

        clearCanvas(chart)
        displayData()
        displaySelectedPoint()
      }
    }
  })

  on(d, 'mode-change', () => {
    clearCanvas(chart)
    clearCanvas(preview)
    displayData(true)
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
      text.textContent = formatAxisValue(axes[axes.length - i - 1])
      svgAttrs(text, { x: 15, y: CHART_HEIGHT - y - 5 /** place text a bit above the line */ })
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
      let label = xLabels[firstLabelX]
      svgAttrs(label, { x: xCoordinate })
      add(xAxes, label)
    }

    for (let i = firstLabelCoordinateIndex; i < xCoordinates.length - 1; i += step) {
      let label = xLabels[(start + i) / step]
      svgAttrs(label, { x: xCoordinates[i] })
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
      pointChartValues[lineName].value.style.color = getTooltipColor(chartData.colors[lineName])
      let text = formatPointValue(data[selectedXIndex])
      if (pointChartValues[lineName].value.textContent !== text) {
        pointChartValues[lineName].value.textContent = text
        applyAnimation(pointChartValues[lineName].value, 'date-change')
      }
      pointChartValues[lineName].value.parentElement.style.display = 'flex'
    })

    setSelectedPointDate(xValue, pointDate)
    let fromRight = xCoordinate > CHART_WIDTH / 2
    selectedPointInfo.style.transform = 'translateX(' + (fromRight ? xCoordinate - 200 : xCoordinate + 20) + 'px)'
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
      drawChartLine(getLineColor(lines.color), xCoordinates, normalized, width)
      return
    }

    if (selectedXIndex >= start && selectedXIndex <= end) {
      drawChartLine(getLineColor(lines.color), xCoordinates.slice(0, selectedXIndex - start), normalized.slice(0, selectedXIndex - start), width, DESELECTED_ALPHA)
      drawChartLine(getLineColor(lines.color), xCoordinates.slice(selectedXIndex - start + 1), normalized.slice(selectedXIndex - start + 1), width, DESELECTED_ALPHA)
      drawChartLine(
        getLineColor(lines.color),
        [((xCoordinates[selectedXIndex - start - 1]) + Math.ceil(width)) || 0],
        [normalized[selectedXIndex - start]],
        Math.max(xCoordinates[selectedXIndex - start + 1] - ((xCoordinates[selectedXIndex - start - 1] + Math.ceil(width)) || 0), width)
      )
      return
    }

    drawChartLine(getLineColor(lines.color), xCoordinates, normalized, width, DESELECTED_ALPHA)
  }

  function buildXCoordinates() {
    return normalizeX(x.slice(start, end + 1), CHART_WIDTH)
  }

  function drawChartLine(color, x, y, width, alpha) {
    drawBars(chart, x, y, color, width, alpha)
  }

  function drawPreviewLine(line, x, y) {
    drawBars(preview, x, y, getLineColor(line.color), PREVIEW_WIDTH / x.length)
  }

  function calculateZoom(start, end) {
    let partShown = Math.round(10 * (end - start) / x.length)
    return Math.round(Math.log2(partShown)) // wow, log2 in JS
  }

  function getXLabelsStep(zoom) {
    return Math.ceil(X_LABELS_STEP * Math.pow(2, zoom))
  }

  function buildXLabels(zoom) {
    let labels = {}
    while (zoom >= 0) {
      let zoomLabels = []
      let step = getXLabelsStep(zoom)
      for (let i = 0; i < x.length; i += step) {
        zoomLabels.push(createSVGText(toXLabel(x[i]), 0, CHART_HEIGHT + X_AXIS_PADDING - 5))
      }
      labels[zoom] = zoomLabels
      zoom--
    }
    return labels
  }

  function eachColumn(columns, callback) {
    columns.forEach(column => callback(column.data, column.name))
  }

  function createYAxes() {
    let yAxesGroupShown = svgEl('g', {}, 'y-axes', 'text')
    let yAxesGroupHidden = svgEl('g', {}, 'y-axes', 'text', 'hidden');

    [yAxesGroupShown, yAxesGroupHidden].forEach(group => {
      for (let i = 0; i < NUMBER_Y_AXES; i++) {
        let text = createSVGText('', 5, 0)
        add(group, text)
      }
    })

    return { yAxesGroupShown, yAxesGroupHidden }
  }

  function createYLines() {
    let lineGroup = svgEl('g', {}, 'y-axes', 'lines')

    let step = Math.ceil(CHART_HEIGHT / NUMBER_Y_AXES)
    for (let i = 0; i < NUMBER_Y_AXES; i++) {
      let line = createAxisLine(15, CHART_WIDTH - 15, CHART_HEIGHT - step * i, CHART_HEIGHT - step * i)
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
    add(container, chart.canvas, createSlider(x, chartRootElement))
    return { previewContainer: container, preview: chart }
  }
}

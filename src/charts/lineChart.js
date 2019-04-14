function createLineChart(chartRootElement, data) {
  let MAX_CHART_WIDTH = 400
  let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth) // same width for preview as well
  let CHART_HEIGHT = 350
  let PREVIEW_WIDTH = CHART_WIDTH - 20
  let PREVIEW_HEIGHT = 50
  let CHART_LINE_WEIGHT = 2
  let PREVIEW_LINE_WEIGHT = 1
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
  let { buttons, visibilityMap } = createButtons(chartData, chartRootElement)
  let { selectedPointInfo, pointChartValues, pointDate } = createSelectedPointInfo(chartData)
  let { xAxes, xAxesHidden } = createXAxes()
  let { yAxesGroupShown, yAxesGroupHidden } = createYAxes()

  let selectedLine = createAxisLine(0, 0, 0, CHART_HEIGHT)
  addClass(selectedLine, 'y-axes', 'lines')
  let chartContainer = el('div', 'charts')

  add(chartContainer, chart, chartSVG, previewContainer, selectedPointInfo)
  add(chartSVG, selectedLine, createYLines(), yAxesGroupShown, yAxesGroupHidden, xAxes, xAxesHidden)

  add(chartRootElement, chartContainer, buttons)

  let start = 0
  let end = x.length
  let selectedXIndex = -1

  let yMin = 0
  let yMax = 0
  let previewYMin = 0
  let previewYMax = 0
  let columnsToShow = chartData.columns

  let xCoordinates = buildXCoordinates()
  let xPreviewCoordinates = normalizeX(x, CHART_WIDTH)

  let { max: newYMax, min: newYMin } = calculateYMinMax(columnsToShow)
  let { max: newPreviewYMax, min: newPreviewYMin } = calculatePreviewYMax(columnsToShow)

  let zoom = calculateZoom(start, end)
  let allXLabels = buildXLabels(zoom)
  let xLabels = allXLabels[zoom]

  let yAxesUpdateTimeout = null

  createChartLines()

  displayPreviewData()

  previewYMax = newPreviewYMax
  previewYMin = newPreviewYMin

  on(chartRootElement, 'visibility-updated', ({ detail: newMap }) => {
    visibilityMap = newMap
    let newColumnsToShow = chartData.columns.filter(column => visibilityMap[column.name])

    let { max: newYMax, min: newYMin } = calculateYMinMax(newColumnsToShow)
    let { max: newPreviewYMax, min: newPreviewYMin } = calculatePreviewYMax(newColumnsToShow)

    animateVisibilityChange(newColumnsToShow, columnsToShow, newYMax, yMax, newYMin, yMin)
    animatePreviewVisibilityChange(newColumnsToShow, columnsToShow, newPreviewYMax, previewYMax, newPreviewYMin, previewYMin)

    displayYAxes(yMax, newYMax, yMin, newYMin)

    yMax = newYMax
    yMin = newYMin
    previewYMax = newPreviewYMax
    previewYMin = newPreviewYMin
    columnsToShow = newColumnsToShow

    displaySelectedPoint()
  })

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

    let minMax = calculateYMinMax(columnsToShow)
    newYMin = minMax.min
    newYMax = minMax.max

    displayData()

    if (!yAxesUpdateTimeout) {
      let _yMax = yMax
      let _yMin = yMin
      yAxesUpdateTimeout = setTimeout(() => {
        displayYAxes(_yMax, newYMax, _yMin, newYMin)
        yAxesUpdateTimeout = null
      }, ANIMATION_TIME)
    }

    yMax = newYMax
    yMin = newYMin

    displayXAxes()
    displaySelectedPoint()
  })

  on(chartSVG, 'click', event => {
    let step = xCoordinates[1] / 2
    let newIndex = start + Math.max(0, xCoordinates.findIndex(xCoordinate => xCoordinate + step > event.offsetX))
    if (newIndex !== selectedXIndex) {
      selectedXIndex = newIndex
      displaySelectedPoint()
    }
  })

  on(d, 'click', event => {
    if (!chartRootElement.contains(event.target)) {
      let newIndex = -1

      if (newIndex !== selectedXIndex) {
        selectedXIndex = newIndex

        displaySelectedPoint()
      }
    }
  })

  on(d, 'mode-change', () => {
    clearCanvas(chart)
    clearCanvas(preview)
    displayData()
    displayPreviewData()
  })

  function displayYAxes(yMax, newYMax, yMin, newYMin) {
    if (newYMax === yMax && yMin === newYMin) {
      return
    }

    let axisStep = Math.ceil((newYMax - newYMin) / NUMBER_Y_AXES)
    let axes = Array.apply(null, Array(NUMBER_Y_AXES)).map((_, i) => newYMin + i * axisStep)
    let normalizedAxes = customNormalize(axes, newYMax, CHART_HEIGHT, 0, newYMin)

    let elements = yAxesGroupHidden.childNodes
    normalizedAxes.reverse().forEach((y, i) => {
      let text = elements[i]
      text.textContent = formatAxisValue(axes[axes.length - i - 1])
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
      selectedLine.style.display = 'none'
      selectedPointInfo.style.display = 'none'
      eachColumn(chartData.columns, (column, lineName) => {
        let point = chartData.lines[lineName].chartPoint
        point.style.animationName = 'exit'
      })
      return
    }

    let xValue = x[selectedXIndex]
    let xCoordinate = CHART_WIDTH * (xValue - x[start]) / (x[end] - x[start])
    svgAttrs(selectedLine, { x1: xCoordinate, x2: xCoordinate })

    eachColumn(chartData.columns, (data, lineName) => {
      let y = customNormalize([data[selectedXIndex]], yMax, CHART_HEIGHT, X_AXIS_PADDING, yMin)[0]
      let point = chartData.lines[lineName].chartPoint
      point.style.animationName = visibilityMap[lineName] ? 'enter' : 'exit'
      svgAttrs(point, { cx: xCoordinate })
      let animate = point.firstChild
      svgAttrs(animate, {
        from: animate.getAttribute('to'),
        to: y,
      })
      animate.beginElement()

      pointChartValues[lineName].value.style.color = getTooltipColor(chartData.colors[lineName])
      pointChartValues[lineName].value.innerText = formatPointValue(data[selectedXIndex])
      pointChartValues[lineName].value.parentElement.style.display = visibilityMap[lineName] ? 'flex' : 'none'
    })

    pointDate.innerText = new Date(xValue).toString().slice(0, 15)
    let fromRight = xCoordinate > CHART_WIDTH / 2
    selectedPointInfo.style.transform = 'translateX(' + (fromRight ? xCoordinate - 200 : xCoordinate + 20) + 'px)'
    selectedPointInfo.style.display = 'block'
    selectedLine.style.display = 'block'
  }

  function calculatePreviewYMax(columns) {
    let allData = columns.reduce((acc, column) => acc.concat(column.data), [])
    return { max: getMax(allData), min: getMin(allData) }
  }

  function calculateYMinMax(columns) {
    let allData = columns.reduce((acc, column) => acc.concat(column.data.slice(start, end + 1)), [])
    return { max: getMax(allData), min: getMin(allData) }
  }

  function animateVisibilityChange(newColumnsToShow, oldColumns, newYMax, oldYMax, newYMin, oldYMin) {
    let yDiff = newYMax - oldYMax
    let yMinDiff = newYMin - oldYMin
    let columnsToUse = newColumnsToShow.length >= columnsToShow.length ? newColumnsToShow : oldColumns

    scheduleAnimation(progress => {
      clearCanvas(chart)
      eachColumn(columnsToUse, (data, columnName) => {
        let lines = chartData.lines[columnName]
        let alpha = 1

        if (!oldColumns.find(column => column.name === columnName)) {
          alpha = Math.min(1, progress * 2)
        } else if (!visibilityMap[columnName]) {
          if (progress === 1) {
            return
          }
          alpha = Math.max(0, 1 - (progress * 2))
        }

        let dataPart = data.slice(start, end + 1)
        let normalized = customNormalize(dataPart, oldYMax + (yDiff * progress), CHART_HEIGHT, 0,
          oldYMin + (yMinDiff * progress))
        drawChartLine(lines, xCoordinates, normalized, alpha)
      })
    }, ANIMATION_TIME)
  }

  function animatePreviewVisibilityChange(newColumnsToShow, oldColumns, newYMax, oldYMax, newYMin, oldYMin) {
    let yDiff = newYMax - oldYMax
    let yMinDiff = newYMin - oldYMin
    let columnsToUse = newColumnsToShow.length >= columnsToShow.length ? newColumnsToShow : oldColumns

    scheduleAnimation(progress => {
      clearCanvas(preview)
      eachColumn(columnsToUse, (data, columnName) => {
        let lines = chartData.lines[columnName]
        let alpha = 1

        if (!oldColumns.find(column => column.name === columnName)) {
          alpha = Math.min(1, progress * 2)
        } else if (!visibilityMap[columnName]) {
          if (progress === 1) {
            return
          }
          alpha = Math.max(0, 1 - (progress * 2))
        }

        let previewNormalized = customNormalize(data, oldYMax + (yDiff * progress),
          PREVIEW_HEIGHT, 0, oldYMin + (yMinDiff * progress))
        drawPreviewLine(lines, xPreviewCoordinates, previewNormalized, alpha)
      })
    }, ANIMATION_TIME)
  }

  function displayData() {
    eachColumn(columnsToShow, (data, lineName) => {
      normalizeAndDisplay(chartData.lines[lineName], data)
    })
  }

  function displayPreviewData() {
    eachColumn(columnsToShow, (data, lineName) => {
      normalizeAndDisplayPreview(chartData.lines[lineName], data)
    })
  }

  function normalizeAndDisplayPreview(lines, data, alpha) {
    let previewNormalized = customNormalize(data, newPreviewYMax, PREVIEW_HEIGHT, 0, newPreviewYMin)
    drawPreviewLine(lines, xPreviewCoordinates, previewNormalized, alpha)
  }

  function normalizeAndDisplay(lines, data, alpha) {
    let dataPart = data.slice(start, end + 1)
    let normalized = customNormalize(dataPart, newYMax, CHART_HEIGHT, 0, newYMin)
    drawChartLine(lines, xCoordinates, normalized, alpha)
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

  function drawChartLine(line, x, y, alpha = 1) {
    drawLine(chart, x, y, getLineColor(line.color), alpha, CHART_LINE_WEIGHT)
  }

  function drawPreviewLine(line, x, y, alpha = 1) {
    drawLine(preview, x, y, getLineColor(line.color), alpha, PREVIEW_LINE_WEIGHT)
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
        zoomLabels.push(toXLabel(x[i]))
      }
      labels[zoom] = zoomLabels
      zoom --
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
      let chartPoint = createChartPoint(color)
      chartPoint.style.animationName = 'exit'
      chartData.lines[lineName] = {
        chartPoint,
        color,
      }
      add(chartPoint, createAnimate('cy'))
      add(chartSVG, chartPoint)
    })
  }

  function createAnimate(attributeName = 'points') {
    return svgEl('animate', { attributeName, repeatCount: 1, dur: '250ms', fill: 'freeze', from: 0, to: 0 })
  }

  function createChartPoint(color) {
    return svgEl('circle', { r: 6, fill: 'white', 'stroke': color, 'stroke-width': CHART_LINE_WEIGHT })
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

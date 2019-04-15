function createBarStackedChart(chartRootElement, data) {
  let MAX_CHART_WIDTH = 400
  let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth)
  let CHART_HEIGHT = 350
  let PREVIEW_WIDTH = CHART_WIDTH - 20
  let PREVIEW_HEIGHT = 50
  let ANIMATION_TIME = 150
  let DESELECTED_ALPHA = 0.5

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
  let { selectedPointInfo, pointChartValues, pointDate, total: pointTotal } = createSelectedPointInfo(chartData, true)
  let { xAxes, xAxesHidden } = createXAxes()
  let { yAxesGroupShown, yAxesGroupHidden } = createYAxes()

  let chartContainer = el('div', 'charts')

  add(chartContainer, chart.canvas, chartSVG, previewContainer, selectedPointInfo)
  add(chartSVG, createYLines(), yAxesGroupShown, yAxesGroupHidden, xAxes, xAxesHidden)

  add(chartRootElement, chartContainer, buttons)

  let start = 0
  let end = x.length
  let selectedXIndex = -1

  let yMax = 0
  let columnsToShow = chartData.columns

  let localXCoordinates = buildXCoordinates()
  let xPreviewCoordinates = normalizeX(x, CHART_WIDTH)

  let cachedSums = {}

  let newYMax = calculateYMax(columnsToShow)
  let newPreviewYMax = calculatePreviewYMax(columnsToShow)

  let zoom = calculateZoom(start, end)
  let allXLabels = buildXLabels(zoom)
  let xLabels = allXLabels[zoom]

  let yAxesUpdateTimeout = null

  let cachedStackedData = {}

  createChartLines()

  let stacked = getStackedData(columnsToShow)
  displayPreviewData(stacked)

  let localStacked

  let previewYMax = newPreviewYMax

  on(chartRootElement, 'visibility-updated', ({ detail: newMap }) => {
    visibilityMap = newMap
    let newColumnsToShow = chartData.columns.filter(column => visibilityMap[column.name])

    let newStackedData = getStackedData(newColumnsToShow)

    newPreviewYMax = calculatePreviewYMax(newColumnsToShow)
    newYMax = calculateYMax(newColumnsToShow)

    displayYAxes(yMax, newYMax)
    animateVisibilityChange(newColumnsToShow, columnsToShow, newStackedData, stacked, newPreviewYMax, previewYMax, newYMax, yMax)

    yMax = newYMax
    previewYMax = newPreviewYMax
    stacked = newStackedData
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
    localXCoordinates = buildXCoordinates()

    newYMax = calculateYMax(columnsToShow)

    localStacked = getLocalStackedData(columnsToShow)

    displayData(localStacked)

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
    let step = localXCoordinates[1] / 2
    let newIndex = start + Math.max(0, localXCoordinates.findIndex(xCoordinate => xCoordinate + step > event.offsetX))
    if (newIndex !== selectedXIndex) {
      selectedXIndex = newIndex

      clearCanvas(chart)
      localStacked = getLocalStackedData(columnsToShow)
      displayData(localStacked)
      displaySelectedPoint()
    }
  })

  on(d, 'click', event => {
    if (!chartRootElement.contains(event.target)) {
      let newIndex = -1

      if (newIndex !== selectedXIndex) {
        selectedXIndex = newIndex
        clearCanvas(chart)
        localStacked = getLocalStackedData(columnsToShow)
        displayData(localStacked)
        displaySelectedPoint()
      }
    }
  })

  on(d, 'mode-change', () => {
    clearCanvas(chart)
    clearCanvas(preview)
    displayData(localStacked)
    displayPreviewData(stacked)
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

  function  displayXAxes() {
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

    for (let i = firstLabelCoordinateIndex; i < localXCoordinates.length - 1; i += step) {
      let label = xLabels[(start + i) / step]
      svgAttrs(label, { x: localXCoordinates[i] })
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
    let total = 0

    eachColumn(chartData.columns, (data, lineName) => {
      total += visibilityMap[lineName] ? data[selectedXIndex] : 0
      pointChartValues[lineName].value.style.color = getTooltipColor(chartData.colors[lineName])
      let text = formatPointValue(data[selectedXIndex])
      if (pointChartValues[lineName].value.textContent !== text) {
        pointChartValues[lineName].value.textContent = text
        applyAnimation(pointChartValues[lineName].value, 'date-change')
      }
      pointChartValues[lineName].value.parentElement.style.display = visibilityMap[lineName] ? 'flex' : 'none'
    })

    setSelectedPointDate(xValue, pointDate)
    pointTotal.value.textContent = formatPointValue(total)
    let fromRight = xCoordinate > CHART_WIDTH / 2
    selectedPointInfo.style.transform = 'translateX(' + (fromRight ? xCoordinate - 200 : xCoordinate + 20) + 'px)'
    selectedPointInfo.style.display = 'block'
  }

  function getLocalStackedData(columns) {
    let stackedData = getStackedData(columns)
    let localStackedData = {}
    Object.keys(stackedData).forEach(line => {
      localStackedData[line] = stackedData[line].slice(start * 2, end * 2 + 2)
    })
    return localStackedData
  }

  function getStackedData(columns) {
    let key = buildKey(columns)
    if (cachedStackedData[key]) {
      return cachedStackedData[key]
    }

    let stackedData = buildStackedData(columns)
    cachedStackedData[key] = stackedData
    return stackedData
  }

  function buildKey(columns) {
    return columns.reduce((acc, column) => acc + column.name, '')
  }

  function buildStackedData(columns) {
    let result = columns.reduce((acc, column) => {
      acc[column.name] = []
      return acc
    }, {})
    for (let i = 0; i < x.length; i++) {
      for (let c = 0; c < columns.length; c++) {
        let column = columns[c]
        let prevColumn = columns[c - 1]
        let bottomValue = prevColumn ? result[prevColumn.name][i * 2] + result[prevColumn.name][i * 2 + 1] : 0
        let topValue = column.data[i]
        result[column.name].push(bottomValue);
        result[column.name].push(topValue);
      }
    }

    return result
  }

  function animateVisibilityChange(newColumnsToShow, oldColumns, newStackedData, oldStackedData, newPreviewYMax, oldPreviewYMax, newYMax, oldYMax) {
    let lines = {}
    let columnsToUse = newColumnsToShow
      .concat(oldColumns)
      .filter(a => {
        let result = lines[a.name]
        lines[a.name] = true
        return !result
      })
      .sort((a, b) => a.name > b.name ? -1 : a.name === b.name ? 0 : 1)

    scheduleAnimation(progress => {
      clearCanvas(chart)
      clearCanvas(preview)

      for (let c = 0; c < columnsToUse.length; c++) {
        let name = columnsToUse[c].name
        let line = chartData.lines[name]
        let toBeAdded = !oldColumns.find(column => column.name === name)
        let toBeRemoved = !visibilityMap[name]
        let prevColumn = columnsToUse[c + 1]

        let dataPart = []

        if (toBeAdded) {
          dataPart = newStackedData[name].slice(0)
          for (let i = 0; i < dataPart.length - 1; i += 2) {
            dataPart[i + 1] = dataPart[i + 1] * progress
          }
        } else if (toBeRemoved) {
          if (progress === 1) {
            continue
          }

          let prevColumnPrevData = prevColumn ? oldStackedData[prevColumn.name] : null
          let prevColumnNextData = prevColumn ? newStackedData[prevColumn.name] : null
          dataPart = oldStackedData[name].slice(0)

          for (let i = 0; i < dataPart.length - 1; i += 2) {
            dataPart[i] = prevColumnPrevData && prevColumnNextData ?
              prevColumnPrevData[i] + (prevColumnNextData[i] - prevColumnPrevData[i]) +
              prevColumnPrevData[i + 1] + (prevColumnNextData[i + 1] - prevColumnPrevData[i + 1]) * progress
              : dataPart[i] - dataPart[i] * progress
            dataPart[i + 1] = dataPart[i + 1] * (1 - progress)
          }
        } else {
          dataPart = newStackedData[name].slice(0)
          let oldValues = oldStackedData[name]

          for (let i = 0; i < dataPart.length - 1; i += 2) {
            dataPart[i] = oldValues[i] + (dataPart[i] - oldValues[i]) * progress
            dataPart[i + 1] = oldValues[i + 1] + (dataPart[i + 1] - oldValues[i + 1]) * progress
          }
        }

        normalizeAndDisplay(line, dataPart.slice(start * 2, end * 2 + 2), oldYMax + (newYMax - oldYMax) * progress)

        let previewNormalized = customNormalize(dataPart, oldPreviewYMax + (newPreviewYMax - oldPreviewYMax) * progress, PREVIEW_HEIGHT)
        drawPreviewLine(line.color, xPreviewCoordinates, previewNormalized)
      }
    }, ANIMATION_TIME)
  }

  function calculatePreviewYMax(columns) {
    return getMax(getSum(columns))
  }

  function calculateYMax(columns) {
    let sums = getSum(columns)
    return getMax(sums.slice(start, end + 1))
  }

  function getSum(columns) {
    let key = buildKey(columns)

    if (cachedSums[key]) {
      return cachedSums[key]
    }

    let sums = calculateSum(columns)
    cachedSums[key] = sums
    return sums
  }

  function calculateSum(columns) {
    let sums = []
    for (let i = 0; i < x.length; i++) {
      sums.push(columns.reduce((acc, column) => acc + column.data[i], 0))
    }
    return sums
  }

  function displayData(percentage) {
    eachColumn(columnsToShow, (_, lineName) => {
      normalizeAndDisplay(chartData.lines[lineName], percentage[lineName], newYMax)
    })
  }

  function displayPreviewData(stacked) {
    eachColumn(columnsToShow, (_, lineName) => {
      normalizeAndDisplayPreview(chartData.lines[lineName], stacked[lineName])
    })
  }

  function normalizeAndDisplayPreview(line, data) {
    let previewNormalized = customNormalize(data, newPreviewYMax, PREVIEW_HEIGHT)
    drawPreviewLine(getLineColor(line.color), xPreviewCoordinates, previewNormalized)
  }

  function normalizeAndDisplay(lines, data, max) {
    let normalized = customNormalize(data, max, CHART_HEIGHT)
    width = CHART_WIDTH / (normalized.length / 2)

    if (selectedXIndex === -1) {
      drawChartLine(getLineColor(lines.color), localXCoordinates, normalized, width)
      return
    }

    if (selectedXIndex >= start && selectedXIndex <= end) {
      drawChartLine(getLineColor(lines.color), localXCoordinates.slice(0, selectedXIndex - start), normalized.slice(0, selectedXIndex * 2 - start * 2), width, DESELECTED_ALPHA)
      drawChartLine(getLineColor(lines.color), localXCoordinates.slice(selectedXIndex - start + 1), normalized.slice(selectedXIndex * 2 - start * 2 + 2), width, DESELECTED_ALPHA)
      drawChartLine(
        getLineColor(lines.color),
        [localXCoordinates[selectedXIndex - start]],
        [normalized[selectedXIndex * 2 - start * 2], normalized[selectedXIndex * 2 - start * 2 + 1]],
        width
      )
      return
    }

    drawChartLine(getLineColor(lines.color), localXCoordinates, normalized, width, DESELECTED_ALPHA)
  }

  function buildXCoordinates() {
    return normalizeX(x.slice(start, end + 1), CHART_WIDTH)
  }

  function drawChartLine(color, x, y, width, alpha) {
    drawStackedBars(chart, x, y, color, width, alpha)
  }

  function drawPreviewLine(color, x, y) {
    drawStackedBars(preview, x, y, color, PREVIEW_WIDTH / x.length)
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
      let y = CHART_HEIGHT - step * i
      let line = createAxisLine(10, CHART_WIDTH - 10, y, y)
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
    let t = svgEl('text', { x, y })
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

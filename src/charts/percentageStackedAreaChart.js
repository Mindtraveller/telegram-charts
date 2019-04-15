function createPercentageStackedAreaChart(chartRootElement, data) {
  let MAX_CHART_WIDTH = 400
  let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth)
  let CHART_HEIGHT = 350
  let CHART_HEIGHT_GAP = 20
  let PREVIEW_WIDTH = CHART_WIDTH - 20
  let PREVIEW_HEIGHT = 50
  let ANIMATION_TIME = 150

  let X_AXIS_PADDING = 20

  let NUMBER_Y_AXES = 5

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

  add(chartContainer, chart.canvas, chartSVG, previewContainer, selectedPointInfo)
  add(chartSVG, selectedLine, createYLines(), yAxesGroupShown, yAxesGroupHidden, xAxes, xAxesHidden)

  add(chartRootElement, chartContainer, buttons)

  let start = 0
  let end = x.length
  let selectedXIndex = -1

  let columnsToShow = chartData.columns

  let xCoordinates = buildXCoordinates()
  let xPreviewCoordinates = normalizeX(x, CHART_WIDTH)

  let zoom = calculateZoom(start, end)
  let allXLabels = buildXLabels(zoom)
  let xLabels = allXLabels[zoom]

  createChartLines()

  let percentage = calculatePercentage(columnsToShow)
  displayPreviewData(percentage)
  displayYAxes()

  on(chartRootElement, 'visibility-updated', ({ detail: newMap }) => {
    visibilityMap = newMap
    let newColumnsToShow = chartData.columns.filter(column => visibilityMap[column.name])

    let newPercentage = calculatePercentage(newColumnsToShow)

    animateVisibilityChange(newColumnsToShow, columnsToShow, newPercentage, percentage)

    percentage = newPercentage
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

    displayData(percentage)

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
    displayData(percentage)
    displayPreviewData(percentage)
  })

  function displayYAxes() {
    let axisStep = Math.ceil(100 / (NUMBER_Y_AXES - 1))
    let axes = Array.apply(null, Array(NUMBER_Y_AXES)).map((_, i) => i * axisStep)
    let normalizedAxes = customNormalize(axes, 100, CHART_HEIGHT - CHART_HEIGHT_GAP).reverse()

    let elements = yAxesGroupHidden.childNodes
    normalizedAxes.forEach((y, i) => {
      let text = elements[i]
      text.textContent = formatAxisValue(axes[axes.length - i - 1])
      svgAttrs(text, { x: 5, y: CHART_HEIGHT - y - 5 /** place text a bit above the line */ })
    })

    yAxesGroupHidden.style.transition = '0s'
    addClass(yAxesGroupHidden, 'm-up')

    let _ = yAxesGroupHidden
    yAxesGroupHidden = yAxesGroupShown
    yAxesGroupShown = _

    // proper position will be set without animation and only then animation will start
    setTimeout(() => {
      yAxesGroupShown.style.transition = null
      yAxesGroupShown.style.opacity = null
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
      return
    }

    let xValue = x[selectedXIndex]
    let xCoordinate = CHART_WIDTH * (xValue - x[start]) / (x[end] - x[start])
    svgAttrs(selectedLine, { x1: xCoordinate, x2: xCoordinate })

    let sum = chartData.columns.reduce((acc, column) => acc + (visibilityMap[column.name] ? column.data[selectedXIndex] : 0), 0)

    eachColumn(chartData.columns, (data, lineName) => {
      pointChartValues[lineName].subValue.innerText = Math.round(data[selectedXIndex] / sum * 100) + '%'
      pointChartValues[lineName].value.style.color = getTooltipColor(chartData.colors[lineName])
      let text = formatPointValue(data[selectedXIndex])
      if (pointChartValues[lineName].value.textContent !== text) {
        pointChartValues[lineName].value.textContent = text
        applyAnimation(pointChartValues[lineName].value, 'date-change')
      }
      pointChartValues[lineName].value.parentElement.style.display = visibilityMap[lineName] ? 'flex' : 'none'
    })

    setSelectedPointDate(xValue, pointDate)

    let fromRight = xCoordinate > CHART_WIDTH / 2
    selectedPointInfo.style.transform = 'translateX(' + (fromRight ? xCoordinate - 200 : xCoordinate + 20) + 'px)'
    selectedPointInfo.style.display = 'block'
    selectedLine.style.display = 'block'
  }

  function calculatePercentage(columns) {
    let result = columns.reduce((acc, column) => {
      acc[column.name] = []
      return acc
    }, {})
    for (let i = 0; i < x.length; i++) {
      let total = columns.reduce((acc, column) => acc + column.data[i], 0)
      for (let c = 0; c < columns.length; c++) {
        let column = columns[c]
        let prevColumn = columns[c - 1]
        let nextColumn = columns[c + 1]
        let bottomValue = prevColumn ? result[prevColumn.name][i * 2 + 1] : 0
        let topValue = !nextColumn ? 1 : bottomValue + (column.data[i] / total)
        result[column.name].push(bottomValue);
        result[column.name].push(topValue);
      }
    }

    return result
  }

  function animateVisibilityChange(newColumnsToShow, oldColumns, newPercentage, oldPercentage) {
    let lines = {}
    let columnsToUse = newColumnsToShow
      .concat(oldColumns)
      .filter(a => {
        let result = lines[a.name]
        lines[a.name] = true
        return !result
      })
      .sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1)

    scheduleAnimation(progress => {
      clearCanvas(chart)
      clearCanvas(preview)

      for (let c = 0; c < columnsToUse.length; c++) {
        let name = columnsToUse[c].name
        let line = chartData.lines[name]
        let toBeAdded = !oldColumns.find(column => column.name === name)
        let toBeRemoved = !visibilityMap[name]
        let prevColumn = columnsToUse[c - 1]
        let nextColumn = columnsToUse[c + 1]

        let dataPart = []

        if (toBeAdded) {
          let prevColumnNextData = prevColumn ? newPercentage[prevColumn.name] : null
          let prevColumnPrevData = prevColumn ? oldPercentage[prevColumn.name] : null
          let nextColumnNextData = nextColumn ? newPercentage[nextColumn.name] : null
          let nextColumnPrevData = nextColumn ? oldPercentage[nextColumn.name] : null
          dataPart = newPercentage[name].slice(0)

          for (let i = 0; i < dataPart.length - 1; i += 2) {
            dataPart[i] = prevColumnNextData ?
              prevColumnPrevData[i + 1] + (prevColumnNextData[i + 1] - prevColumnPrevData[i + 1]) * progress :
              prevColumnPrevData ? prevColumnPrevData[i + 1] * (1 - progress) : 0
            dataPart[i + 1] = nextColumnNextData ?
              nextColumnPrevData[i] + (nextColumnNextData[i] - nextColumnPrevData[i]) * progress :
              prevColumnPrevData && !prevColumnNextData ? 1 : !prevColumnNextData ? progress : 1
          }
        } else if (toBeRemoved) {
          if (progress === 1) {
            continue
          }

          let prevColumnNextData = prevColumn ? newPercentage[prevColumn.name] : null
          let prevColumnPrevData = prevColumn ? oldPercentage[prevColumn.name] : null
          let nextColumnNextData = nextColumn ? newPercentage[nextColumn.name] : null
          let nextColumnPrevData = nextColumn ? oldPercentage[nextColumn.name] : null
          dataPart = oldPercentage[name].slice(0)

          for (let i = 0; i < dataPart.length - 1; i += 2) {
            dataPart[i] = prevColumnPrevData && prevColumnNextData ?
              prevColumnPrevData[i + 1] + (prevColumnNextData[i + 1] - prevColumnPrevData[i + 1]) * progress :
              prevColumnNextData ?
                prevColumnNextData[i + 1] * progress :
                !nextColumnNextData ?
                  dataPart[i] + (1 - dataPart[i]) * progress : dataPart[i] * (1 - progress)

            dataPart[i + 1] = nextColumnPrevData && nextColumnNextData ?
              nextColumnPrevData[i] + (nextColumnNextData[i] - (nextColumnPrevData[i] || 1)) * progress :
              nextColumnNextData ? 1 - progress : 1
          }
        } else {
          dataPart = newPercentage[name].slice(0)
          let oldValues = oldPercentage[name]

          for (let i = 0; i < dataPart.length - 1; i += 2) {
            dataPart[i] = oldValues[i] + (dataPart[i] - oldValues[i]) * progress
            dataPart[i + 1] = oldValues[i + 1] + (dataPart[i + 1] - oldValues[i + 1]) * progress
          }
        }

        normalizeAndDisplay(line, dataPart)
        normalizeAndDisplayPreview(line, dataPart)
      }
    }, ANIMATION_TIME)
  }

  function displayData(percentage) {
    eachColumn(columnsToShow, (_, lineName) => {
      normalizeAndDisplay(chartData.lines[lineName], percentage[lineName])
    })
  }

  function displayPreviewData(percentage) {
    eachColumn(columnsToShow, (_, lineName) => {
      normalizeAndDisplayPreview(chartData.lines[lineName], percentage[lineName])
    })
  }

  function normalizeAndDisplayPreview(line, data) {
    let previewNormalized = customNormalize(data, 1, PREVIEW_HEIGHT)
    drawPreviewLine(line, xPreviewCoordinates, previewNormalized)
  }

  function normalizeAndDisplay(lines, data) {
    let dataPart = data.slice(start * 2, end * 2 + 2)
    let normalized = customNormalize(dataPart, 1, CHART_HEIGHT - CHART_HEIGHT_GAP)
    drawChartLine(lines, xCoordinates, normalized)
  }

  function buildXCoordinates() {
    return normalizeX(x.slice(start, end + 1), CHART_WIDTH)
  }

  function drawChartLine(line, x, y) {
    drawStackedArea(chart, x, y, getLineColor(line.color))
  }

  function drawPreviewLine(line, x, y) {
    drawStackedArea(preview, x, y, getLineColor(line.color))
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
    let yAxesGroupHidden = svgEl('g', {}, 'y-axes', 'text', 'm-up');
    yAxesGroupHidden.style.opacity = '0'

    for (let i = 0; i < NUMBER_Y_AXES; i++) {
      let text = createSVGText('', 5, 0)
      add(yAxesGroupHidden, text)
    }

    return { yAxesGroupHidden }
  }

  function createYLines() {
    let lineGroup = svgEl('g', {}, 'y-axes', 'lines')

    let step = Math.ceil((CHART_HEIGHT - CHART_HEIGHT_GAP) / (NUMBER_Y_AXES - 1))
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

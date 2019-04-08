function createChart(data) {
    let chartsContainer = d.getElementById('charts-container');
    let MAX_CHART_WIDTH = 500;
    let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth); // same width for preview as well
    let CHART_HEIGHT = 400;
    let PREVIEW_WIDTH = CHART_WIDTH - 20
    let PREVIEW_HEIGHT = 50;
    let CHART_LINE_WEIGHT = 2
    let PREVIEW_LINE_WEIGHT = 1
    let ANIMATION_TIME = 250

    let X_AXIS_PADDING = 20;

    let NUMBER_Y_AXES = 5;
    let Y_AXES_PERCENT_CALCULATION = 0.95; // this allows axes to be positioned a bit bellow the top border of chart

    let ZOOM_STEP = 10 * CHART_WIDTH / MAX_CHART_WIDTH;
    let X_LABELS_MAX_NUMBER = 6; // desired number, not concrete one :)

    let x = data.columns[0].slice(1);
    let chartData = {
        ...data,
        columns: data.columns.slice(1).map(column => ({ name: column[0], data: column.slice(1) })),
        lines: {},
    };

    let X_LABELS_STEP = Math.round(x.length / ZOOM_STEP / X_LABELS_MAX_NUMBER);

    let chartRootElement = el('div', 'chart-wrapper');
    let chartSVG = createChartElement()
    let chart = createCanvas(CHART_WIDTH, CHART_HEIGHT)
    let { preview, previewContainer } = createPreview();
    let { buttons, visibilityMap } = createButtons(chartData, chartRootElement);
    let { selectedPointInfo, pointChartValues, pointDate } = createSelectedPointInfo();
    let { xAxes, xAxesHidden } = createXAxes();
    let { yAxesGroupShown, yAxesGroupHidden } = createYAxes();
    let selectedLine = createAxisLine(0, 0, X_AXIS_PADDING, X_AXIS_PADDING + CHART_HEIGHT);

    add(chartSVG, createZeroYAxis(), selectedLine, yAxesGroupShown, yAxesGroupHidden, xAxes, xAxesHidden)
    add(chartRootElement, chart, chartSVG, previewContainer, buttons, selectedPointInfo)

    let start = 0;
    let end = x.length;
    let selectedXIndex = -1;

    let yMax = 0;
    let previewYMax = 0;
    let columnsToShow = chartData.columns;

    let xCoordinates = buildXCoordinates();
    let xPreviewCoordinates = normalizeX(x, CHART_WIDTH);

    let newYMax = calculateYMax(columnsToShow);
    let newPreviewYMax = calculatePreviewYMax(columnsToShow);

    let zoom = calculateZoom(start, end);
    let xLabels = buildXLabels(zoom);

    let yAxesUpdateTimeout = null;

    createChartLines();
    add(chartsContainer, chartRootElement);

    displayData(true);
    displayYAxes(yMax, newYMax);

    yMax = newYMax;
    previewYMax = newPreviewYMax;

    on(chartRootElement, 'visibility-updated', ({ detail: newMap }) => {
        visibilityMap = newMap;
        let newColumnsToShow = chartData.columns.filter(column => visibilityMap[column.name]);

        newYMax = calculateYMax(newColumnsToShow);
        newPreviewYMax = calculatePreviewYMax(newColumnsToShow);

        animateVisibilityChange(newColumnsToShow, columnsToShow, newYMax, yMax, newPreviewYMax, previewYMax)

        displayYAxes(yMax, newYMax);

        yMax = newYMax;
        previewYMax = newPreviewYMax;
        columnsToShow = newColumnsToShow;

        displaySelectedPoint();
    });

    on(chartRootElement, 'border-changed', ({ detail: { start: newStart, end: newEnd } }) => {
        let newZoom = calculateZoom(newStart, newEnd);

        if (newZoom !== zoom) {
            xLabels = buildXLabels(newZoom);
            animateXLabels(zoom, newZoom, start, newStart, end, newEnd);
            zoom = newZoom;
        }

        clearCanvas(chart)

        start = newStart;
        end = newEnd;
        xCoordinates = buildXCoordinates();

        newYMax = calculateYMax(columnsToShow);
        displayData();

        if (!yAxesUpdateTimeout) {
            let _yMax = yMax;
            yAxesUpdateTimeout = setTimeout(() => {
                displayYAxes(_yMax, newYMax);
                yAxesUpdateTimeout = null;
            }, 100);
        }

        yMax = newYMax;

        displayXAxes();
        displaySelectedPoint();
    });

    on(chartSVG, 'click', event => {
        let step = xCoordinates[1] / 2;
        let newIndex = start + Math.max(0, xCoordinates.findIndex(xCoordinate => xCoordinate + step > event.offsetX));
        if (newIndex !== selectedXIndex) {
            selectedXIndex = newIndex;
            displaySelectedPoint();
        }
    });

    on(d, 'click', event => {
        if (!chartRootElement.contains(event.target)) {
            selectedXIndex = -1;
            displaySelectedPoint();
        }
    })

    function displayYAxes(yMax, newYMax) {
        if (newYMax === yMax) {
            return
        }

        let axisStep = Math.ceil(newYMax * Y_AXES_PERCENT_CALCULATION / (NUMBER_Y_AXES - 1));
        let axes = Array.apply(null, Array(NUMBER_Y_AXES - 1)).map((_, i) => (i + 1) * axisStep);
        let normalizedAxes = customNormalize(axes, getMax(axes), CHART_HEIGHT * Y_AXES_PERCENT_CALCULATION, X_AXIS_PADDING);

        let elements = yAxesGroupHidden.childNodes;
        normalizedAxes.forEach((y, i) => {
            svgAttrs(elements[i * 2], { y1: y, y2: y });
            let text = elements[i * 2 + 1];
            text.textContent = axes[axes.length - i - 1];
            svgAttrs(text, { x: 5, y: y - 5 /** place text a bit above the line */ });
        });

        removeClass(yAxesGroupHidden, 'm-down', 'm-up');
        removeClass(yAxesGroupShown, 'm-down', 'm-up');
        addClass(yAxesGroupHidden, newYMax > yMax ? 'm-up' : 'm-down', 'pending');
        addClass(yAxesGroupShown, newYMax > yMax ? 'm-down' : 'm-up', 'pending');

        let _ = yAxesGroupHidden;
        yAxesGroupHidden = yAxesGroupShown;
        yAxesGroupShown = _;

        // proper position will be set without animation and only then animation will start
        setTimeout(() => {
            removeClass(yAxesGroupShown, 'hidden', 'pending');
            removeClass(yAxesGroupHidden, 'pending');
            addClass(yAxesGroupHidden, 'hidden');
        }, 0);
    }

    function displayXAxes() {
        clearChildren(xAxes);

        let step = getXLabelsStep(zoom);
        let firstLabelCoordinateIndex = 1; // do not pick the first item for nice indents from the chart borders
        while ((start + firstLabelCoordinateIndex) % step !== 0) {
            firstLabelCoordinateIndex++;
        }

        // always insert label the will be there when zoom doubles as first label
        if ((start + firstLabelCoordinateIndex) % (step * 2) !== 0) {
            let firstLabelX = (start + firstLabelCoordinateIndex - step) / (step * 2);
            let xCoordinate = CHART_WIDTH * (x[firstLabelX] - x[start]) / (x[end] - x[start]);
            let label = createSVGText(xLabels[firstLabelX], xCoordinate, -2);
            add(xAxes, label);
        }

        for (let i = firstLabelCoordinateIndex; i < xCoordinates.length - 1; i += step) {
            let label = createSVGText(xLabels[(start + i) / step], xCoordinates[i], -2);
            add(xAxes, label);
        }
    }

    function animateXLabels(zoom, newZoom, oldStart, newStart, oldEnd, newEnd) {
        let startMoved = oldStart !== newStart;
        let endMoved = oldEnd !== newEnd;

        if (!(startMoved && endMoved)) {
            let _ = xAxes;
            xAxes = xAxesHidden;
            xAxesHidden = _;

            addClass(xAxes, 'pending', endMoved ? 'right' : '', newZoom > zoom ? 'even' : '');
            removeClass(xAxes, endMoved ? '' : 'right', newZoom > zoom ? '' : 'even');
            addClass(xAxesHidden, endMoved ? 'right' : '');
            removeClass(xAxesHidden, 'even', newZoom > zoom ? 'pending' : '', endMoved ? '' : 'right');
            setTimeout(() => {
                removeClass(xAxes, 'hidden');
                addClass(xAxesHidden, 'hidden');
            }, 0);
        }
    }

    function displaySelectedPoint() {
        if (selectedXIndex === -1 || selectedXIndex < start || selectedXIndex > end) {
            selectedLine.style.display = 'none';
            selectedPointInfo.style.display = 'none';
            eachColumn(chartData.columns, (column, lineName) => {
                let point = chartData.lines[lineName].chartPoint;
                point.style.animationName = 'exit';
            });
            return;
        }

        let xValue = x[selectedXIndex];
        let xCoordinate = CHART_WIDTH * (xValue - x[start]) / (x[end] - x[start]);
        svgAttrs(selectedLine, { x1: xCoordinate, x2: xCoordinate });

        eachColumn(chartData.columns, (data, lineName) => {
            let y = customNormalize([data[selectedXIndex]], yMax, CHART_HEIGHT, X_AXIS_PADDING)[0];
            let point = chartData.lines[lineName].chartPoint;
            point.style.animationName = visibilityMap[lineName] ? 'enter' : 'exit';
            svgAttrs(point, { cx: xCoordinate });
            let animate = point.firstChild;
            svgAttrs(animate, {
                from: animate.getAttribute('to'),
                to: y,
            });
            animate.beginElement();

            pointChartValues[lineName].innerText = data[selectedXIndex];
            pointChartValues[lineName].parentElement.style.display = visibilityMap[lineName] ? 'flex' : 'none';
        });

        pointDate.innerText = new Date(xValue).toString().slice(0, 10);
        let fromRight = xCoordinate > CHART_WIDTH / 2;
        selectedPointInfo.style[fromRight ? 'right' : 'left'] = `${fromRight ? CHART_WIDTH - xCoordinate : xCoordinate}px`;
        selectedPointInfo.style[fromRight ? 'left' : 'right'] = null;
        selectedPointInfo.style.display = 'block';
        selectedLine.style.display = 'block';
    }

    function calculatePreviewYMax(columns) {
        return getMax(columns.reduce((acc, column) => acc.concat(column.data), []));
    }

    function calculateYMax(columns) {
        return getMax(columns.reduce((acc, column) => acc.concat(column.data.slice(start, end + 1)), []));
    }

    function animateVisibilityChange(newColumnsToShow, oldColumns, newYMax, oldYMax, newPreviewYMax, oldPreviewYMax) {
        let isAdding = newColumnsToShow.length > columnsToShow.length
        let yDiff = newYMax - oldYMax
        let previewYDiff = newPreviewYMax - oldPreviewYMax
        let columnsToUse = isAdding ? newColumnsToShow : oldColumns

        scheduleAnimation(progress => {
            clearCharts()
            eachColumn(columnsToUse, (data, columnName) => {
                let lines = chartData.lines[columnName]
                let alpha = 1

                if (isAdding && !oldColumns.find(column => column.name === columnName)) {
                    alpha = Math.min(1, progress * 2)
                } else if (!isAdding && !visibilityMap[columnName]) {
                    alpha = Math.max(0, 1 - (progress * 2))
                }

                let dataPart = data.slice(start, end + 1)
                let normalized = customNormalize(dataPart, oldYMax + (yDiff * progress), CHART_HEIGHT)
                drawChartLine(lines, xCoordinates, normalized, alpha)

                let previewNormalized = customNormalize(data, oldPreviewYMax + (previewYDiff * progress),
                  PREVIEW_HEIGHT)
                drawPreviewLine(lines, xPreviewCoordinates, previewNormalized, alpha)
            })
        }, ANIMATION_TIME)
    }

    function displayData(updatePreview = false) {
        eachColumn(columnsToShow, (data, lineName) => {
            normalizeAndDisplay(chartData.lines[lineName], data);
            updatePreview && normalizeAndDisplayPreview(chartData.lines[lineName], data);
        });
    }

    function normalizeAndDisplayPreview(lines, data, alpha) {
        let previewNormalized = customNormalize(data, newPreviewYMax, PREVIEW_HEIGHT);
        drawPreviewLine(lines, xPreviewCoordinates, previewNormalized, alpha)
    }

    function normalizeAndDisplay(lines, data, alpha) {
        let dataPart = data.slice(start, end + 1);
        let normalized = customNormalize(dataPart, newYMax, CHART_HEIGHT);
        drawChartLine(lines, xCoordinates, normalized, alpha)
    }

    function buildXCoordinates() {
        return normalizeX(x.slice(start, end + 1), CHART_WIDTH);
    }

    function normalizeX(data, points) {
        let min = data[0];
        let max = data[data.length - 1];
        let delta = Math.abs(max - min);
        return data.map(item => points * (item - min) / delta);
    }

    function customNormalize(data, max, points, padding = 0) {
        return data.map(item => !max ? padding : (points * item / max) + padding);
    }

    function clearChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function drawChartLine(line, x, y, alpha = 1) {
        drawLine(chart, x, y, line.color, alpha, CHART_LINE_WEIGHT)
    }

    function drawPreviewLine(line, x, y, alpha = 1) {
        drawLine(preview, x, y, line.color, alpha, PREVIEW_LINE_WEIGHT)
    }

    function clearCharts() {
        clearCanvas(chart)
        clearCanvas(preview)
    }

    function calculateZoom(start, end) {
        let partShown = Math.round(10 * (end - start) / x.length);
        return Math.round(Math.log2(partShown)); // wow, log2 in JS
    }

    function getXLabelsStep(zoom) {
        return Math.ceil(X_LABELS_STEP * Math.pow(2, zoom));
    }

    function buildXLabels(zoom) {
        let labels = [];
        let step = getXLabelsStep(zoom);
        for (let i = 0; i < x.length; i += step) {
            labels.push(toXLabel(x[i]));
        }
        return labels;
    }

    function toXLabel(timestamp) {
        let label = (new Date(timestamp)).toString().slice(4, 10);
        return label[4] === '0' ? `${label.slice(0, 4)}${label[5]}` : label; // remove leading zeros
    }

    function eachColumn(columns, callback) {
        columns.forEach(column => callback(column.data, column.name));
    }

    function getMax(data) {
        return Math.max(...data);
    }

    function createYAxes() {
        let yAxesGroupShown = svgEl('g', {}, 'y-axes');
        let yAxesGroupHidden = svgEl('g', {}, 'y-axes', 'hidden');

        [yAxesGroupShown, yAxesGroupHidden].forEach(group => {
            for (let i = 0; i < NUMBER_Y_AXES; i++) {
                let line = createAxisLine(10, CHART_WIDTH - 10, 0, 0);
                let text = createSVGText('', 5, 0);
                add(group, line, text);
            }
        });

        return { yAxesGroupShown, yAxesGroupHidden };
    }

    function createXAxes() {
        return { xAxes: svgEl('g', {}, 'x-axes'), xAxesHidden: svgEl('g', {}, 'x-axes', 'hidden') };
    }

    function createChartLines() {
        eachColumn(columnsToShow, (column, lineName) => {
            let color = chartData.colors[lineName];
            let chartPoint = createChartPoint(color);
            chartPoint.style.animationName = 'exit';
            chartData.lines[lineName] = {
                chartPoint,
                color,
            };
            add(chartPoint, createAnimate('cy'));
            add(chartSVG, chartPoint)
        });
    }

    function createAnimate(attributeName = 'points') {
        return svgEl('animate', { attributeName, repeatCount: 1, dur: '250ms', fill: 'freeze', from: 0, to: 0 });
    }

    function createChartLine(color, width) {
        return svgEl('polyline', { fill: 'none', 'stroke': color, 'stroke-width': width });
    }

    function createChartPoint(color) {
        return svgEl('circle', { r: 6, fill: 'white', 'stroke': color, 'stroke-width': CHART_LINE_WEIGHT });
    }

    function createZeroYAxis() {
        let group = svgEl('g');
        add(group, createAxisLine(10, CHART_WIDTH - 10, X_AXIS_PADDING, X_AXIS_PADDING), createSVGText('0', 5, X_AXIS_PADDING + 15));
        return group;
    }

    function createAxisLine(x1, x2, y1, y2) {
        return svgEl('line', { x1, y1, x2, y2, fill: 'gray', stroke: 'gray', 'stroke-width': .3 });
    }

    function createSVGText(text, x, y) {
        let t = svgEl('text', { x, y, 'font-size': 13 });
        t.textContent = text;
        return t;
    }

    function createChartElement() {
        return svgEl('svg', { viewBox: `0 0 ${CHART_WIDTH} ${CHART_HEIGHT + X_AXIS_PADDING}` });
    }

    function createPreview() {
        let container = el('div', 'preview-container');
        let chart = createCanvas(PREVIEW_WIDTH, PREVIEW_HEIGHT)
        add(container, chart, createSlider(x, chartRootElement))
        return { previewContainer: container, preview: chart }
    }

    function createSelectedPointInfo() {
        let info = el('div', 'point-info');
        let chartInfoContainer = el('div', 'charts-info');
        let date = el('div');
        add(info, date, chartInfoContainer);
        let chartValues = Object.entries(chartData.names).reduce((acc, [chart, chartName]) => {
            let div = el('div', 'info');
            div.style.color = chartData.colors[chart];
            let value = el('span');
            acc[chart] = value;
            add(div, value, t(chartName));
            add(chartInfoContainer, div);
            return acc;
        }, {});

        return { selectedPointInfo: info, pointChartValues: chartValues, pointDate: date };
    }
}

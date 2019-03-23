function createChart(data) {
    let chartsContainer = d.getElementById('charts-container');
    let MAX_CHART_WIDTH = 500;
    let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth); // same width for preview as well
    let CHART_HEIGHT = 400;
    let PREVIEW_HEIGHT = 50;
    let CHART_LINE_WEIGHT = 2.5
    let PREVIEW_LINE_WEIGHT = 1.5

    let X_AXIS_PADDING = 20;

    let NUMBER_Y_AXES = 5;
    let Y_AXES_PERCENT_CALCULATION = 0.95; // this allows axes to be positioned a bit bellow the top border of chart

    let ZOOM_STEP = 10 * CHART_WIDTH / MAX_CHART_WIDTH;
    let X_LABELS_MAX_NUMBER = 6; // desired number, not concrete one :)

    let x = data.columns[0].slice(1);
    let chartData = {
        ...data,
        columns: data.columns.slice(1),
        lines: {},
    };

    let X_LABELS_STEP = Math.round(x.length / ZOOM_STEP / X_LABELS_MAX_NUMBER);

    let chartRootElement = el('div', 'chart-wrapper');
    let chart = createChartElement();
    let { preview, previewContainer } = createPreview();
    let { buttons, visibilityMap } = createButtons(chartData, chartRootElement);
    let { selectedPointInfo, pointChartValues, pointDate } = createSelectedPointInfo();
    let { xAxes, xAxesHidden } = createXAxes();
    let { yAxesGroupShown, yAxesGroupHidden } = createYAxes();

    add(chart, createZeroYAxis(), yAxesGroupShown, yAxesGroupHidden, xAxes, xAxesHidden);
    add(chartRootElement, chart, previewContainer, buttons, selectedPointInfo);

    let start = 0;
    let end = undefined;
    let selectedXIndex = -1;
    let selectedLine;

    let yMax = 0;
    let previewYMax = 0;
    // TODO: change structure to { name, data } to get rid of extra slices
    let columnsToShow = chartData.columns.filter(column => visibilityMap[column[0]]);

    let xCoordinates = buildXCoordinates();
    let xPreviewCoordinates = normalize(x, CHART_WIDTH);

    let newYMax = calculateYMax(columnsToShow);
    let newPreviewYMax = calculatePreviewYMax(columnsToShow);

    let zoom = calculateZoom(start, end);
    let xLabels = buildXLabels();

    createChartLines();
    add(chartsContainer, chartRootElement);

    displayData(true);
    displayYAxes();

    yMax = newYMax;
    previewYMax = newPreviewYMax;

    on(chartRootElement, 'visibility-updated', ({ detail: newMap }) => {
        visibilityMap = newMap;
        let newColumnsToShow = chartData.columns.filter(column => visibilityMap[column[0]]);

        newYMax = calculateYMax(newColumnsToShow);
        newPreviewYMax = calculatePreviewYMax(newColumnsToShow);

        let isAdding = newColumnsToShow.length > columnsToShow.length;
        let columnsToUse = isAdding ? newColumnsToShow : columnsToShow;
        eachColumn(columnsToUse, (column, columnName) => {
            let data = column.slice(1);
            let alpha = visibilityMap[columnName] ? 1 : 0;
            normalizeAndDisplay(chartData.lines[columnName], data, alpha);
            normalizeAndDisplayPreview(chartData.lines[columnName], data, alpha);
        });

        displayYAxes();

        yMax = newYMax;
        previewYMax = newPreviewYMax;
        columnsToShow = newColumnsToShow;

        displaySelectedPoint();
    });

    on(chartRootElement, 'border-changed', ({ detail: { start: newStart, end: newEnd } }) => {
        let newZoom = calculateZoom(newStart, newEnd);

        if (newZoom !== zoom) {
            zoom = newZoom;
            console.log(zoom);
            xLabels = buildXLabels();
            animateXLabels(start, newStart, end, newEnd);
        }

        start = newStart;
        end = newEnd;
        xCoordinates = buildXCoordinates();

        newYMax = calculateYMax(columnsToShow);
        displayData();
        displayYAxes();
        displayXAxes();

        yMax = newYMax;

        displaySelectedPoint();
    });

    on(chart, 'click', event => {
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

    function displayYAxes() {
        if (newYMax === yMax) {
            return
        }

        let axisStep = Math.ceil(newYMax * Y_AXES_PERCENT_CALCULATION / (NUMBER_Y_AXES - 1));
        let axes = Array.apply(null, Array(NUMBER_Y_AXES - 1)).map((_, i) => (i + 1) * axisStep);
        let normalizedAxes = customNormalize(axes, getMax(axes), CHART_HEIGHT * Y_AXES_PERCENT_CALCULATION, X_AXIS_PADDING);
        clearChildren(yAxesGroupHidden);

        normalizedAxes.forEach((y, i) => {
            let line = createAxisLine(10, CHART_WIDTH - 10, y, y);
            let text = createSVGText(axes[axes.length - i - 1], 5, y - 5 /** place text a bit above the line */);
            add(yAxesGroupHidden, line, text);
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

        let step = getLabelsStep();
        let firstLabelCoordinateIndex = 1; // do not pick the first item for nice indents from the chart borders
        while ((start + firstLabelCoordinateIndex) % step !== 0) {
            firstLabelCoordinateIndex++;
        }

        for (let i = firstLabelCoordinateIndex; i < xCoordinates.length - 1; i += step) {
            let label = createSVGText(xLabels[(start + i) / step], xCoordinates[i], 0);
            add(xAxes, label);
        }
    }

    function animateXLabels(oldStart, newStart, oldEnd, newEnd) {
        let startMoved = oldStart !== newStart;
        let endMoved = oldEnd !== newEnd;
        let startMovedLeft = oldStart > newStart;
        let endMovedLeft = oldEnd > newEnd;

        let _ = xAxes;
        xAxes = xAxesHidden;
        xAxesHidden = _;

        addClass(xAxes, 'pending');
        removeClass(xAxes, 'hidden', 'right')
        addClass(xAxesHidden, 'hidden');
        removeClass(xAxesHidden, 'pending', 'right');

        if (endMoved && !endMovedLeft && !startMoved) {
            addClass(xAxesHidden, 'right');
        }
    }

    function displaySelectedPoint() {
        if (selectedLine) {
            chart.removeChild(selectedLine);
            selectedLine = null;
        }

        if (selectedXIndex === -1) {
            selectedPointInfo.style.display = 'none';
            eachColumn(chartData.columns, (column, lineName) => {
                let point = chartData.lines[lineName].chartPoint;
                point.style.animationName = 'exit';
            })
            return;
        }

        // TODO: hide points when selected index is outside of window

        let xValue = x[selectedXIndex];
        let xCoordinate = CHART_WIDTH * (xValue - x[start]) / (x[end - 1] - x[start]);
        selectedLine = createAxisLine(xCoordinate, xCoordinate, X_AXIS_PADDING, X_AXIS_PADDING + CHART_HEIGHT);

        eachColumn(chartData.columns, (column, lineName) => {
            let data = column.slice(1);
            // TODO: get rid of normalization
            let normalized = customNormalize(data, yMax, CHART_HEIGHT, X_AXIS_PADDING);
            let point = chartData.lines[lineName].chartPoint;
            point.style.animationName = visibilityMap[lineName] ? 'enter' : 'exit';
            svgAttrs(point, { cx: xCoordinate });
            let animate = point.firstChild;
            svgAttrs(animate, {
                from: animate.getAttribute('to'),
                to: normalized[selectedXIndex],
            });
            animate.beginElement();

            pointChartValues[lineName].innerText = data[selectedXIndex];
            pointChartValues[lineName].parentElement.style.display = visibilityMap[lineName] ? 'flex' : 'none';
        });

        chart.insertBefore(selectedLine, chart.firstChild); // to be behind another items
        pointDate.innerText = new Date(xValue).toString().slice(0, 10);
        let fromRight = xCoordinate > CHART_WIDTH / 2;
        selectedPointInfo.style[fromRight ? 'right' : 'left'] = `${fromRight ? CHART_WIDTH - xCoordinate : xCoordinate}px`;
        selectedPointInfo.style[fromRight ? 'left' : 'right'] = null;
        selectedPointInfo.style.display = 'block';
    }

    function calculatePreviewYMax(columns) {
        return getMax(columns.reduce((acc, column) => acc.concat(column.slice(1)), []));
    }

    function calculateYMax(columns) {
        return getMax(columns.reduce((acc, column) => acc.concat(column.slice(1 + start, end ? 1 + end : undefined)), []));
    }

    function displayData(updatePreview = false) {
        eachColumn(columnsToShow, (column, lineName) => {
            let data = column.slice(1);
            normalizeAndDisplay(chartData.lines[lineName], data);
            updatePreview && normalizeAndDisplayPreview(chartData.lines[lineName], data);
        });
    }

    function normalizeAndDisplayPreview(lines, data, alpha) {
        let previewNormalized = customNormalize(data, newPreviewYMax, PREVIEW_HEIGHT);
        let previewNormalizedOld = customNormalize(data, previewYMax, PREVIEW_HEIGHT);
        drawLine(lines.preview, xPreviewCoordinates, previewNormalized, previewNormalizedOld, alpha);
    }

    function normalizeAndDisplay(lines, data, alpha) {
        let dataPart = data.slice(start, end);
        let normalized = customNormalize(dataPart, newYMax, CHART_HEIGHT, X_AXIS_PADDING);
        let normalizedOld = customNormalize(dataPart, yMax, CHART_HEIGHT, X_AXIS_PADDING);
        drawLine(lines.chart, xCoordinates, normalized, normalizedOld, alpha);
    }

    function buildXCoordinates() {
        return normalize(x.slice(start, end), CHART_WIDTH);
    }

    function normalize(data, points) {
        let min = Math.min(...data);
        let max = getMax(data);
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

    function drawLine(line, x, y, oldY, alpha = 1) {
        let animate = line.firstChild;
        let from = x.reduce((acc, x, i) => acc + `${x},${oldY[i]} `, '');
        let to = x.reduce((acc, x, i) => acc + `${x},${y[i]} `, '');
        svgAttrs(animate, { from, to });
        line.style.animationName = alpha ? 'enter' : 'exit';
        animate.beginElement();
    }

    function calculateZoom(start, end = x.length) {
        let partShown = Math.round(10 * (end - start) / x.length);
        return Math.round(Math.log2(partShown)); // first time I used log in JS :)
    }

    function getLabelsStep() {
        return Math.ceil(X_LABELS_STEP * Math.pow(2, zoom));
    }

    function buildXLabels() {
        let labels = [];
        let step = getLabelsStep();
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
        columns.forEach(column => callback(column, column[0]));
    }

    function getMax(data) {
        return Math.max(...data);
    }

    function createYAxes() {
        return { yAxesGroupShown: svgEl('g', {}, 'y-axes'), yAxesGroupHidden: svgEl('g', {}, 'y-axes', 'hidden') };
    }

    function createXAxes() {
        return { xAxes: svgEl('g', {}, 'x-axes'), xAxesHidden: svgEl('g', {}, 'x-axes', 'hidden') };
    }

    function createChartLines() {
        eachColumn(columnsToShow, (column, lineName) => {
            let color = chartData.colors[lineName];
            let chartLine = createChartLine(color, CHART_LINE_WEIGHT);
            let previewLine = createChartLine(color, PREVIEW_LINE_WEIGHT);
            let chartPoint = createChartPoint(color);
            chartPoint.style.animationName = 'exit';
            chartData.lines[lineName] = {
                chart: chartLine,
                preview: previewLine,
                chartPoint,
            };
            add(chartLine, createAnimate());
            add(previewLine, createAnimate());
            add(chartPoint, createAnimate('cy'));
            add(chart, chartLine, chartPoint);
            add(preview, previewLine);
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
        add(group, createAxisLine(10, CHART_WIDTH - 10, X_AXIS_PADDING, X_AXIS_PADDING), createSVGText('0', 5, -X_AXIS_PADDING));
        return group;
    }

    function createAxisLine(x1, x2, y1, y2) {
        return svgEl('line', { x1, y1, x2, y2, fill: 'gray', stroke: 'gray', 'stroke-width': .3 });
    }

    function createSVGText(text, x, y) {
        let t = svgEl('text', { x, y });
        t.textContent = text;
        return t;
    }

    function createChartElement() {
        return svgEl('svg', { viewBox: `0 0 ${CHART_WIDTH} ${CHART_HEIGHT + X_AXIS_PADDING}` });
    }

    function createPreview() {
        let container = el('div', 'preview-container');
        let svg = svgEl('svg', { viewBox: `0 0 ${CHART_WIDTH} ${PREVIEW_HEIGHT}` });
        add(container, svg, createSlider(chartData, chartRootElement));
        return { previewContainer: container, preview: svg };
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

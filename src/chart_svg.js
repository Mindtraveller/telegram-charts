function createChart(data) {
    let chartsContainer = d.getElementById('charts-container');
    let MAX_CHART_WIDTH = 500;
    let CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth); // same width for preview as well
    let CHART_HEIGHT = 400;
    let PREVIEW_HEIGHT = 50;

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

    let chartRootElement = addClass(el('div'), 'chart-wrapper');
    let chart = createChart();
    let { preview, previewContainer } = createPreview();
    let { buttons, visibilityMap } = createButtons(chartData, chartRootElement);
    let { selectedPointInfo, pointChartValues, pointDate } = createSelectedPointInfo();
    let { xAxes, xAxesHidden } = createXAxes();

    add(chart, xAxes);
    add(chart, xAxesHidden);
    add(chartRootElement, chart);
    add(chartRootElement, previewContainer);
    add(chartRootElement, buttons);
    add(chartRootElement, selectedPointInfo);
    add(chartsContainer, chartRootElement);

    let yAxesGroupShown;
    let yAxesGroupHidden;

    let start = 0;
    let end = undefined;
    let selectedXIndex = -1;
    let selectedLine;

    let yMax = 0;
    let previewYMax = 0;
    let columnsToShow = chartData.columns.filter(column => visibilityMap[column[0]]);

    let xCoordinates = buildXCoordinates();
    let xPreviewCoordinates = normalize(x, CHART_WIDTH);

    let newYMax = calculateLocalYMax(columnsToShow);
    let newPreviewYMax = calculateYMax(columnsToShow);
    let newVisibilityMap;
    let newColumnsToShow;

    let zoom = calculateZoom(start, end);
    let xLabels = buildXLabels();

    createChartLines();
    createYAxesGroup();
    displayData(true);
    displayYAxes();

    yMax = newYMax;
    previewYMax = newPreviewYMax;

    on(chartRootElement, 'visibility-updated', ({ detail: newMap }) => {
        newVisibilityMap = newMap;
        newColumnsToShow = chartData.columns.filter(column => newVisibilityMap[column[0]]);

        newYMax = calculateLocalYMax(newColumnsToShow);
        newPreviewYMax = calculateYMax(newColumnsToShow);

        animateUpdate();
        displayYAxes();

        visibilityMap = newVisibilityMap;
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

        newYMax = calculateLocalYMax(columnsToShow);
        displayData();
        displayYAxes();
        displayXAxes();

        yMax = newYMax;

        displaySelectedPoint();
    });

    on(chart, 'click', event => {
        let touchPoint = event.offsetX;
        let step = xCoordinates[1] / 2;
        let newIndex = start + Math.max(0, xCoordinates.findIndex(xCoordinate => xCoordinate + step > touchPoint));
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
        let normalizedAxes = customNormalize(axes, getMax(axes), CHART_HEIGHT * Y_AXES_PERCENT_CALCULATION);
        clearChildren(yAxesGroupHidden);
        normalizedAxes.forEach((y, i) => {
            let line = createAxisLine(10, CHART_WIDTH - 10, y + X_AXIS_PADDING, y + X_AXIS_PADDING);
            let text = createSVGText(axes[axes.length - i - 1], 5, y);
            add(yAxesGroupHidden, line);
            add(yAxesGroupHidden, text);
        });
        removeClass(yAxesGroupHidden, 'm-down', 'm-up');
        removeClass(yAxesGroupShown, 'm-down', 'm-up');
        addClass(yAxesGroupHidden, newYMax > yMax ? 'm-up' : 'm-down', 'pending');
        addClass(yAxesGroupShown, newYMax > yMax ? 'm-down' : 'm-up', 'pending');
        let _ = yAxesGroupHidden;
        yAxesGroupHidden = yAxesGroupShown;
        yAxesGroupShown = _;

        // proper position will be set without transition time
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
            chartData.columns.forEach(column => {
                let lineName = column[0];
                let point = chartData.lines[lineName].chartPoint;
                point.style.animationName = 'exit';
            })
            return;
        }

        let xValue = x[selectedXIndex];
        let pointCoordinate = CHART_WIDTH * (xValue - x[start]) / (x[end - 1] - x[start]);
        selectedLine = createAxisLine(pointCoordinate, pointCoordinate, X_AXIS_PADDING, X_AXIS_PADDING + CHART_HEIGHT);

        chartData.columns.forEach(column => {
            let lineName = column[0];
            let data = column.slice(1);
            let normalized = customNormalize(data, yMax, CHART_HEIGHT, X_AXIS_PADDING);
            let point = chartData.lines[lineName].chartPoint
            point.style.animationName = visibilityMap[lineName] ? 'enter' : 'exit';
            svgAttrs(point, { cx: pointCoordinate })
            let animate = point.firstChild;
            svgAttrs(animate, {
                from: animate.getAttribute('to'),
                to: normalized[selectedXIndex]
            });
            animate.beginElement();

            pointChartValues[lineName].innerText = data[selectedXIndex];
            pointChartValues[lineName].parentElement.style.display = visibilityMap[lineName] ? 'flex' : 'none';
        });

        chart.insertBefore(selectedLine, chart.firstChild);
        pointDate.innerText = new Date(xValue).toString().slice(0, 10);
        let fromRight = pointCoordinate > CHART_WIDTH / 2;
        selectedPointInfo.style[fromRight ? 'right' : 'left'] = `${fromRight ? CHART_WIDTH - pointCoordinate : pointCoordinate}px`;
        selectedPointInfo.style[fromRight ? 'left' : 'right'] = null;
        selectedPointInfo.style.display = 'block';
    }

    function calculateYMax(columns) {
        let previewValues = columns.reduce((acc, column) => acc.concat(column.slice(1)), []);
        return getMax(previewValues);
    }

    function calculateLocalYMax(columns) {
        let values = columns.reduce((acc, column) => acc.concat(column.slice(1 + start, end ? 1 + end : undefined)), []);
        return getMax(values);
    }

    function createYAxesGroup() {
        let g1 = svgEl('g');
        let g2 = svgEl('g');
        addClass(g1, 'y-axes');
        addClass(g2, 'y-axes', 'hidden');
        chart.insertBefore(g1, chart.firstChild);
        chart.insertBefore(g2, chart.firstChild);
        // zero axes is not animatable
        chart.insertBefore(crateZeroAxisLine(), chart.firstChild);
        yAxesGroupShown = g1;
        yAxesGroupHidden = g2;
    }

    function createXAxes() {
        let xAxes = svgEl('g');
        addClass(xAxes, 'x-axes');
        let xAxesHidden = svgEl('g');
        addClass(xAxesHidden, 'x-axes', 'hidden');
        return {
            xAxes,
            xAxesHidden
        };
    }

    function createChartLines() {
        eachColumn(columnsToShow, (column, lineName) => {
            let color = chartData.colors[lineName];
            let chartLine = createChartLine(color, 2.5);
            let previewLine = createChartLine(color, 1.5);
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
            add(chart, chartLine);
            add(chart, chartPoint);
            add(preview, previewLine);
        });
    }

    function displayData(updatePreview = false) {
        eachColumn(columnsToShow, (column, lineName) => {
            let data = column.slice(1);
            normalizeAndDisplay(chartData.lines[lineName], data);
            updatePreview && normalizeAndDisplayPreview(chartData.lines[lineName], data);
        });
    }

    function animateUpdate() {
        let isAdding = newColumnsToShow.length > columnsToShow.length;
        let columnsToUse = isAdding ? newColumnsToShow : columnsToShow;
        eachColumn(columnsToUse, (column, columnName) => {
            let data = column.slice(1);
            let alpha = newVisibilityMap[columnName] ? 1 : 0;
            normalizeAndDisplay(chartData.lines[columnName], data, alpha);
            normalizeAndDisplayPreview(chartData.lines[columnName], data, alpha);
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

    function createAnimate(attributeName = 'points') {
        return svgEl('animate', { attributeName, repeatCount: 1, dur: '250ms', fill: 'freeze', from: 0, to: 0 });
    }

    function createChartLine(color, width) {
        return svgEl('polyline', { fill: 'none', 'stroke': color, 'stroke-width': width });
    }

    function createChartPoint(color) {
        return svgEl('circle', { r: 6, fill: 'white', 'stroke': color, 'stroke-width': 2.5 });
    }

    function crateZeroAxisLine() {
        let group = svgEl('g');
        let line = createAxisLine(10, CHART_WIDTH - 10, X_AXIS_PADDING, X_AXIS_PADDING);
        let text = createSVGText('0', 5, -X_AXIS_PADDING);
        add(group, line);
        add(group, text);
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

    function createChart() {
        return svgEl('svg', { viewBox: `0 0 ${CHART_WIDTH} ${CHART_HEIGHT + X_AXIS_PADDING}` });
    }

    function createPreview() {
        let container = addClass(el('div'), 'preview-container');
        let svg = svgEl('svg', { viewBox: `0 0 ${CHART_WIDTH} ${PREVIEW_HEIGHT}` });
        add(container, svg);
        add(container, createSlider(chartData, chartRootElement));
        return { previewContainer: container, preview: svg };
    }

    function createSelectedPointInfo() {
        let info = el('div');
        addClass(info, 'point-info');
        let chartInfoContainer = el('div');
        addClass(chartInfoContainer, 'charts-info');
        let date = el('div');
        add(info, date);
        add(info, chartInfoContainer);
        let chartValues = Object.entries(chartData.names).reduce((acc, [chart, chartName]) => {
            let div = el('div');
            div.style.color = chartData.colors[chart];
            addClass(div, 'info');
            let value = el('span');
            add(div, value);
            acc[chart] = value;
            add(div, t(chartName));
            add(chartInfoContainer, div);
            return acc;
        }, {})

        return {
            selectedPointInfo: info,
            pointChartValues: chartValues,
            pointDate: date,
        };
    }
}

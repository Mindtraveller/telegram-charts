function createChart(data) {
    const chartsContainer = document.getElementById('charts-container');
    const MAX_CHART_WIDTH = 500;
    const CHART_WIDTH = Math.min(MAX_CHART_WIDTH, window.innerWidth);
    const CHART_HEIGHT = 400;

    const PREVIEW_WIDTH = Math.min(500, window.innerWidth);
    const PREVIEW_HEIGHT = 50;

    const X_AXIS_PADDING = 20;

    const NUMBER_Y_AXES = 5;
    const Y_AXES_PERCENT_CALCULATION = 0.95; // this allows axes to be positioned a bit bellow the top border of chart

    const ZOOM_STEP = 10 * CHART_WIDTH / MAX_CHART_WIDTH;
    const X_LABELS_MAX_NUMBER = 6; // desired number, not concrete one :)

    const x = data.columns[0].slice(1);
    const chartData = {
        ...data,
        columns: data.columns.slice(1),
        lines: {},
    };

    const X_LABELS_STEP = Math.round(x.length / ZOOM_STEP / X_LABELS_MAX_NUMBER);

    const chartRootElement = createChartRootElement();
    const chart = createChart();
    const { preview, previewContainer } = createPreview();
    let { buttons, visibilityMap } = createButtons(chartData, chartRootElement);
    const { selectedPointInfo, pointChartValues, pointDate } = createSelectedPointInfo();
    let { xAxes, xAxesHidden } = createXAxes();

    chart.appendChild(xAxes);
    chart.appendChild(xAxesHidden);
    chartRootElement.appendChild(chart);
    chartRootElement.appendChild(previewContainer)
    chartRootElement.appendChild(buttons);
    chartRootElement.appendChild(selectedPointInfo);
    chartsContainer.appendChild(chartRootElement);

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
    let xPreviewCoordinates = normalize(x, PREVIEW_WIDTH);

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
        const newZoom = calculateZoom(newStart, newEnd);

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
        const touchPoint = event.offsetX;
        const step = xCoordinates[1] / 2;
        const newIndex = start + Math.max(0, xCoordinates.findIndex(xCoordinate => xCoordinate + step > touchPoint));
        if (newIndex !== selectedXIndex) {
            selectedXIndex = newIndex;
            displaySelectedPoint();
        }
    });

    function displayYAxes() {
        if (newYMax === yMax) {
            return
        }

        const axisStep = Math.ceil(newYMax * Y_AXES_PERCENT_CALCULATION / (NUMBER_Y_AXES - 1));
        const axes = Array.apply(null, Array(NUMBER_Y_AXES - 1)).map((_, i) => (i + 1) * axisStep);
        const normalizedAxes = customNormalize(axes, getMax(axes), CHART_HEIGHT * Y_AXES_PERCENT_CALCULATION);
        clearChildren(yAxesGroupHidden);
        normalizedAxes.forEach((y, i) => {
            const line = createAxisLine(10, CHART_WIDTH - 10, y + X_AXIS_PADDING, y + X_AXIS_PADDING);
            const text = createSVGText(axes[axes.length - i - 1], 5, y);
            yAxesGroupHidden.appendChild(line);
            yAxesGroupHidden.appendChild(text);
        });
        removeClass(yAxesGroupHidden, 'm-down', 'm-up');
        removeClass(yAxesGroupShown, 'm-down', 'm-up');
        addClass(yAxesGroupHidden, newYMax > yMax ? 'm-up' : 'm-down', 'pending');
        addClass(yAxesGroupShown, newYMax > yMax ? 'm-down' : 'm-up', 'pending');
        const _ = yAxesGroupHidden;
        yAxesGroupHidden = yAxesGroupShown;
        yAxesGroupShown = _;
        setTimeout(() => {
            removeClass(yAxesGroupShown, 'hidden', 'pending');
            removeClass(yAxesGroupHidden, 'pending');
            addClass(yAxesGroupHidden, 'hidden');
        }, 0);
    }

    function displayXAxes() {
        clearChildren(xAxes);

        const step = getLabelsStep();
        let firstLabelCoordinateIndex = 1; // do not pick the first item for nice indents from the chart borders
        while ((start + firstLabelCoordinateIndex) % step !== 0) {
            firstLabelCoordinateIndex++;
        }

        for (let i = firstLabelCoordinateIndex; i < xCoordinates.length - 1; i += step) {
            const label = createSVGText(xLabels[(start + i) / step], xCoordinates[i], 0);
            xAxes.appendChild(label);
        }
    }

    function animateXLabels(oldStart, newStart, oldEnd, newEnd) {
        const startMoved = oldStart !== newStart;
        const endMoved = oldEnd !== newEnd;
        const startMovedLeft = oldStart > newStart;
        const endMovedLeft = oldEnd > newEnd;

        const _ = xAxes;
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
        if (selectedXIndex === -1) {
            return;
        }

        if (selectedLine) {
            chart.removeChild(selectedLine);
        }

        const xValue = x[selectedXIndex];
        const pointCoordinate = CHART_WIDTH * (xValue - x[start]) / (x[end - 1] - x[start]);
        selectedLine = createAxisLine(pointCoordinate, pointCoordinate, X_AXIS_PADDING, X_AXIS_PADDING + CHART_HEIGHT);

        chartData.columns.forEach(column => {
            const lineName = column[0];
            const data = column.slice(1);
            const normalized = customNormalize(data, yMax, CHART_HEIGHT, X_AXIS_PADDING);
            const point = chartData.lines[lineName].chartPoint
            point.style.animationName = visibilityMap[lineName] ? 'enter' : 'exit';
            setSVGAttr(point, 'cx', pointCoordinate);
            const animate = point.firstChild;
            setSVGAttr(animate, 'from', animate.getAttribute('to'));
            setSVGAttr(animate, 'to', normalized[selectedXIndex]);
            animate.beginElement();

            pointChartValues[lineName].innerText = data[selectedXIndex];
            pointChartValues[lineName].parentElement.style.display = visibilityMap[lineName] ? 'flex' : 'none';
        });

        chart.insertBefore(selectedLine, chart.firstChild);
        pointDate.innerText = new Date(xValue).toString().slice(0, 10);
        const fromRight = pointCoordinate > CHART_WIDTH / 2;
        selectedPointInfo.style[fromRight ? 'right' : 'left'] = `${fromRight ? CHART_WIDTH - pointCoordinate : pointCoordinate}px`;
        selectedPointInfo.style[fromRight ? 'left' : 'right'] = null;
        selectedPointInfo.style.display = 'block';
    }

    function calculateYMax(columns) {
        const previewValues = columns.reduce((acc, column) => acc.concat(column.slice(1)), []);
        return getMax(previewValues);
    }

    function calculateLocalYMax(columns) {
        const values = columns.reduce((acc, column) => acc.concat(column.slice(1 + start, end ? 1 + end : undefined)), []);
        return getMax(values);
    }

    function createYAxesGroup() {
        const g1 = createSVGElement('g');
        const g2 = createSVGElement('g');
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
        const xAxes = createSVGElement('g');
        addClass(xAxes, 'x-axes');
        const xAxesHidden = createSVGElement('g');
        addClass(xAxesHidden, 'x-axes', 'hidden');
        return {
            xAxes,
            xAxesHidden
        };
    }

    function createChartLines() {
        columnsToShow.forEach(column => {
            const lineName = column[0];
            const color = chartData.colors[lineName];
            const chartLine = createChartLine(color, 2.5);
            const previewLine = createChartLine(color, 1.5);
            const chartPoint = createChartPoint(color);
            chartPoint.style.animationName = 'exit';
            chartData.lines[lineName] = {
                chart: chartLine,
                preview: previewLine,
                chartPoint,
            };
            chartLine.appendChild(createAnimate());
            previewLine.appendChild(createAnimate());
            chartPoint.appendChild(createAnimate('cy'));
            chart.appendChild(chartLine);
            chart.appendChild(chartPoint);
            preview.appendChild(previewLine);
        });
    }

    function displayData(updatePreview = false) {
        columnsToShow.forEach(column => {
            const lineName = column[0];
            const data = column.slice(1);
            normalizeAndDisplay(chartData.lines[lineName], data);
            updatePreview && normalizeAndDisplayPreview(chartData.lines[lineName], data);
        });
    }

    function animateUpdate() {
        const isAdding = newColumnsToShow.length > columnsToShow.length;
        const columnsToUse = isAdding ? newColumnsToShow : columnsToShow;
        columnsToUse.forEach(column => {
            const columnName = column[0];
            const data = column.slice(1);
            const alpha = newVisibilityMap[columnName] ? 1 : 0;
            normalizeAndDisplay(chartData.lines[columnName], data, alpha);
            normalizeAndDisplayPreview(chartData.lines[columnName], data, alpha);
        });
    }

    function normalizeAndDisplayPreview(lines, data, alpha) {
        const previewNormalized = customNormalize(data, newPreviewYMax, PREVIEW_HEIGHT);
        const previewNormalizedOld = customNormalize(data, previewYMax, PREVIEW_HEIGHT);
        drawLine(lines.preview, xPreviewCoordinates, previewNormalized, previewNormalizedOld, alpha);
    }

    function normalizeAndDisplay(lines, data, alpha) {
        const dataPart = data.slice(start, end);
        const normalized = customNormalize(dataPart, newYMax, CHART_HEIGHT, X_AXIS_PADDING);
        const normalizedOld = customNormalize(dataPart, yMax, CHART_HEIGHT, X_AXIS_PADDING);
        drawLine(lines.chart, xCoordinates, normalized, normalizedOld, alpha);
    }

    function buildXCoordinates() {
        return normalize(x.slice(start, end), CHART_WIDTH);
    }

    function normalize(data, points) {
        const min = Math.min(...data);
        const max = getMax(data);
        const delta = Math.abs(max - min);
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
        const animate = line.firstChild;
        // animate.endElement();
        const from = x.reduce((acc, x, i) => acc + `${x},${oldY[i]} `, '');
        const to = x.reduce((acc, x, i) => acc + `${x},${y[i]} `, '');
        setSVGAttr(animate, 'from', from);
        setSVGAttr(animate, 'to', to);
        line.style.animationName = alpha ? 'enter' : 'exit';
        animate.beginElement();
    }

    function calculateZoom(start, end = x.length, currentZoom = 1) {
        const partShown = Math.round(10 * (end - start) / x.length);
        return Math.round(Math.log2(partShown))
    }

    function getLabelsStep() {
        return Math.ceil(X_LABELS_STEP * Math.pow(2, zoom));
    }

    function buildXLabels() {
        const labels = [];
        const step = getLabelsStep();
        for (let i = 0; i < x.length; i += step) {
            labels.push(toXLabel(x[i]));
        }
        return labels;
    }

    function toXLabel(timestamp) {
        const label = (new Date(timestamp)).toString().slice(4, 10);
        return label[4] === '0' ? `${label.slice(0, 4)}${label[5]}` : label; // remove leading zeros
    }

    function getMax(data) {
        return Math.max(...data);
    }

    function createAnimate(attribute = 'points') {
        const animate = createSVGElement('animate');
        setSVGAttr(animate, 'attributeName', attribute);
        setSVGAttr(animate, 'repeatCount', 1);
        setSVGAttr(animate, 'dur', '250ms');
        setSVGAttr(animate, 'fill', 'freeze');
        return animate;
    }

    function createChartLine(color, width) {
        const line = createSVGElement('polyline');
        setSVGAttr(line, 'fill', 'none');
        setSVGAttr(line, 'stroke', color);
        setSVGAttr(line, 'stroke-width', width);
        return line;
    }

    function createChartPoint(color) {
        const line = createSVGElement('circle');
        setSVGAttr(line, 'r', 6);
        setSVGAttr(line, 'fill', 'white');
        setSVGAttr(line, 'stroke', color);
        setSVGAttr(line, 'stroke-width', 2.5);
        return line;
    }

    function crateZeroAxisLine() {
        const group = createSVGElement('g');
        const line = createAxisLine(10, CHART_WIDTH - 10, X_AXIS_PADDING, X_AXIS_PADDING);
        const text = createSVGText('0', 5, -X_AXIS_PADDING);
        group.appendChild(line);
        group.appendChild(text);
        return group;
    }

    function createAxisLine(x1, x2, y1, y2) {
        const line = createSVGElement('line');
        setSVGAttr(line, 'x1', x1);
        setSVGAttr(line, 'y1', y1);
        setSVGAttr(line, 'x2', x2);
        setSVGAttr(line, 'y2', y2);
        setSVGAttr(line, 'fill', 'gray');
        setSVGAttr(line, 'stroke', 'gray');
        setSVGAttr(line, 'stroke-width', 0.3);
        return line;
    }

    function createSVGText(text, x, y) {
        const t = createSVGElement('text');
        setSVGAttr(t, 'x', x);
        setSVGAttr(t, 'y', y);
        t.textContent = text;
        return t;
    }

    function createChart() {
        const svg = createSVGElement('svg');
        setSVGAttr(svg, 'viewBox', `0 0 ${CHART_WIDTH} ${CHART_HEIGHT + X_AXIS_PADDING}`);
        return svg;
    }

    function createChartRootElement() {
        const root = createElement('div');
        addClass(root, 'chart-wrapper');
        return root;
    }

    function createPreview() {
        const container = createElement('div');
        addClass(container, 'preview-container');
        const svg = createSVGElement('svg');
        setSVGAttr(svg, 'viewBox', `0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}`);
        container.appendChild(svg);
        container.appendChild(createSlider(chartData, chartRootElement));
        return {
            previewContainer: container,
            preview: svg
        };
    }

    function createSelectedPointInfo() {
        const info = createElement('div');
        addClass(info, 'point-info-container');
        const chartInfoContainer = createElement('div');
        addClass(chartInfoContainer, 'point-info__chart-info-container');
        const date = createElement('div');
        info.appendChild(date);
        info.appendChild(chartInfoContainer);
        const chartValues = Object.entries(chartData.names).reduce((acc, [chart, chartName]) => {
            const div = createElement('div');
            div.style.color = chartData.colors[chart];
            addClass(div, 'point-info__chart-info');
            const value = createElement('span');
            div.appendChild(value);
            acc[chart] = value;
            div.appendChild(createText(chartName))
            chartInfoContainer.appendChild(div)
            return acc;
        }, {})

        return {
            selectedPointInfo: info,
            pointChartValues: chartValues,
            pointDate: date,
        };
    }
}

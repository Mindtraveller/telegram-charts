function normalizeValue(value, max, points, padding = 0, min = 0) {
  return Math.ceil(!max ? padding : (points * (value - min) / (max - min)) + padding)
}

function customNormalize(data, max, points, padding = 0, min = 0) {
  let result = data.slice(0)
  for (let i = 0; i < data.length; i++) {
    result[i] = Math.ceil(!max ? padding : (points * (result[i] - min) / (max - min)) + padding)
  }
  return result
}

function getMax(arr) {
  let max = arr[0]
  for(let i = 1; i < arr.length; i++) {
    max = arr[i] > max ? arr[i] : max
  }
  return max
}

function getMin(arr) {
  let min = arr[0]
  for(let i = 1; i < arr.length; i++) {
    min = arr[i] < min ? arr[i] : min
  }
  return min
}
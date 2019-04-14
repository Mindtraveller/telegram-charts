function customNormalize(data, max, points, padding = 0, min = 0) {
  let result = data.slice(0)
  for (let i = 0; i < data.length; i++) {
    result[i] = Math.round(!max ? padding : (points * (result[i] - min) / (max - min)) + padding)
  }
  return result
}
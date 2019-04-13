function formatAxisValue(value) {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1)  + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1)  + 'K'
  }
  return value
}

function formatPointValue(value) {
  let result = ''
  let strValue = value.toString()
  for (let i = 0; i < strValue.length / 3; i ++) {
    result = strValue.slice(Math.max(0, strValue.length - i * 3 - 3), strValue.length - i * 3) + ' ' + result
  }
  return result
}
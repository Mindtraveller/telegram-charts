function getLineColor(color) {
  return isDark ? LINE_DARK_COLORS[color] : LINE_COLORS[color]
}

function getButtonColor(color) {
  return isDark ? BUTTON_DARK_COLORS[color] : BUTTON_COLORS[color]
}

function getTooltipColor(color) {
  return isDark ? TOOLTIP_DARK_COLORS[color] : TOOLTIP_COLORS[color]
}

const BUTTON_COLORS = {
  '#FE3C30': '#E65850',
  '#4BD964': '#5FB641',

  '#108BE3': '#3497ED',
  '#E8AF14': '#F5BD25',

  "#3497ED": '#3497ED',
  "#2373DB": '#3381E8',
  "#9ED448": '#9ED448',
  "#5FB641": '#5FB641',
  "#F5BD25": '#F5BD25',
  "#F79E39": '#F79E39',
  "#E65850": '#E65850'
}

const BUTTON_DARK_COLORS = {
  '#FE3C30': '#CF5D57',
  '#4BD964': '#5AB34D',

  '#108BE3': '#4681BB',
  '#E8AF14': '#C9AF4F',

  "#3497ED": '#4681BB',
  "#2373DB": '#466FB3',
  "#9ED448": '#88BA52',
  "#5FB641": '#3DA05A',
  "#F5BD25": '#F5BD25',
  "#F79E39": '#D49548',
  "#E65850": '#CF5D57'
}

const TOOLTIP_COLORS = {
  '#FE3C30': '#F34C44',
  '#4BD964': '#3CC23F',

  '#108BE3': '#108BE3',
  '#E8AF14': '#E4AE1B',

  '#64ADED': '#3896E8',

  "#3497ED": '#108BE3',
  "#2373DB": '#2373DB',
  "#9ED448": '#89C32E',
  "#5FB641": '#4BAB29',
  "#F5BD25": '#EAAF10',
  "#F79E39": '#F58608',
  "#E65850": '#F34C44'
}

const TOOLTIP_DARK_COLORS = {
  '#FE3C30': '#F7655E',
  '#4BD964': '#4BD964',

  '#108BE3': '#108BE3',
  '#E8AF14': '#DEB93F',

  '#64ADED': '#4082CE',

  "#3497ED": '#5199DF',
  "#2373DB": '#3E65CF',
  "#9ED448": '#99CF60',
  "#5FB641": '#3CB560',
  "#F5BD25": '#DBB630',
  "#F79E39": '#EE9D39',
  "#E65850": '#F7655E'
}

const LINE_COLORS = {
  '#FE3C30': '#FE3C30',
  '#4BD964': '#4BD964',

  '#108BE3': '#108BE3',
  '#E8AF14': '#E8AF14',

  '#64ADED': '#64ADED',

  "#3497ED": '#3497ED',
  "#2373DB": '#2373DB',
  "#9ED448": '#9ED448',
  "#5FB641": '#5FB641',
  "#F5BD25": '#F5BD25',
  "#F79E39": '#F79E39',
  "#E65850": '#E65850'
}

const LINE_DARK_COLORS = {
  '#FE3C30': '#E6574F',
  '#4BD964': '#4BD964',

  '#108BE3': '#108BE3',
  '#E8AF14': '#DEB93F',

  '#64ADED': '#4082CE',

  "#3497ED": '#4681BB',
  "#2373DB": '#345B9C',
  "#9ED448": '#88BA52',
  "#5FB641": '#3DA05A',
  "#F5BD25": '#D9B856',
  "#F79E39": '#D49548',
  "#E65850": '#CF5D57'
}

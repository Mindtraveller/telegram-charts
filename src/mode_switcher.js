let isDark = false;

(() => {
  let LIGHT_LABEL = 'Switch to Night Mode';
  let DARK_LABEL = 'Switch to Day Mode';

  let button = d.getElementById('mode-switcher');
  on(button, 'click', handleModeSwitch);
  button.innerText = LIGHT_LABEL;

  function handleModeSwitch() {
    d.body.classList.toggle('dark');
    isDark = !isDark;
    button.innerText = isDark ? DARK_LABEL : LIGHT_LABEL;
  }
})();

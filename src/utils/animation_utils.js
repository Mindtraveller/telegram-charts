function scheduleAnimation(callback, duration) {
  let startTime = performance.now()

  function rafCallback(frameTime) {
    let progress = Math.min(1, Math.max(0, frameTime - startTime) / duration)
    if (progress < 1) {
      requestAnimationFrame(rafCallback)
    }
    callback(progress)
  }

  requestAnimationFrame(rafCallback)
}

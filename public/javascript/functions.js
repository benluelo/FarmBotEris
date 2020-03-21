let currentPlot = null

const farmbotBrown = getComputedStyle(document.documentElement).getPropertyValue("--farmbot-brown")
const selected = "0.1em solid black"

/**
 * @description Clamps a number between two provided values.
 * @param {Number} num - The number to clamp.
 * @param {Number} min - The minimum value for the number.
 * @param {Number} max - The maximum value for the number.
 * @returns {Number} The clamped number.
 */
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

/**
 * Ye.
 * @param {HTMLElement} plot - The plot the user clicked on.
 */
function displayInfo(plot) {
    if (currentPlot) {
        if (currentPlot === plot) {
            currentPlot.style.background = farmbotBrown
            currentPlot.style.borderRight = ""
            currentPlot.style.borderBottom = ""
            currentPlot.style.margin = ""
            currentPlot = null
        } else {
            plot.style.background = "#782717"
            plot.style.borderRight = selected
            plot.style.borderBottom = selected
            plot.style.margin = "0 0.1em 0.1em 0"
            currentPlot.style.background = farmbotBrown
            currentPlot.style.borderRight = ""
            currentPlot.style.borderBottom = ""
            currentPlot.style.margin = ""
            currentPlot = plot
        }
    } else {
        plot.style.background = "#782717"
        plot.style.borderRight = selected
        plot.style.borderBottom = selected
        plot.style.margin = "0 0.1em 0.1em 0"
        currentPlot = plot
    }
    const plotInfo = plot.dataset
    const growthPercentage = clamp(((Date.now() - parseInt(plotInfo.growthProgress)) / parseInt(plotInfo.growthTime)), 0, 1) * 100
    console.log(growthPercentage)
    if (currentPlot) {
        document.getElementById("progress-bar-container").style.visibility = "visible"
        document.getElementById("progress-bar").style.width = `${growthPercentage}%`
        document.getElementById("progress-bar").innerHTML = `${growthPercentage.toFixed(2)}%`
    } else {
        document.getElementById("progress-bar-container").style.visibility = "hidden"
    }
}
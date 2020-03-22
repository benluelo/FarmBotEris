function resizeText() {
    const plots = document.getElementsByClassName("plot")
    // console.log(plots)
    for (const e in plots) {
        if (plots.item(e).children[0]) {
            // console.log(e, "yeet")
            console.log(plots.item(e).children[0].parentElement.clientHeight)
            plots.item(e).children[0].style.fontSize = (plots.item(e).children[0].clientHeight * 0.75) + "px"
        }
    }
}

window.addEventListener("resize", resizeText)
resizeText()

let currentPlot = null

const farmbotBrown = getComputedStyle(document.documentElement).getPropertyValue("--farmbot-brown")
// const selected = `1rem outset ${farmbotBrown}`

/**
 * Ye.
 * @param {HTMLElement} e - The plot the user clicked on.
 */
function select(e) {
    // e.style.background = "var(--color5)"
    // e.style.border = selected
    e.classList.toggle("shimmer")
}

/**
 * Ye.
 * @param {HTMLElement} e - The plot the user clicked on.
 */
function deSelect(e) {
    // e.style.background = farmbotBrown
    // e.style.border = ""
    e.classList.toggle("shimmer")
}

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
            deSelect(currentPlot)
            currentPlot = null
        } else {
            deSelect(currentPlot)
            select(plot)
            currentPlot = plot
        }
    } else {
        select(plot)
        currentPlot = plot
    }
    const plotInfo = plot.dataset
    const growthPercentage = clamp(((Date.now() - parseInt(plotInfo.growthProgress)) / parseInt(plotInfo.growthTime)), 0, 1) * 100
    if (currentPlot) {
        document.getElementById("progress-bar-container").style.visibility = "visible"
        document.getElementById("progress-bar").style.width = `${growthPercentage}%`
        document.getElementById("progress-bar").innerHTML = `${growthPercentage.toFixed(2)}%`
    } else {
        document.getElementById("progress-bar-container").style.visibility = "hidden"
    }
}
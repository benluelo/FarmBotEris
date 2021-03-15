// import emojis from "../bot/lib/crop-data.js"
// import twemoji from "twemoji"
// import fs from "fs"
// import fetch from "node-fetch"
// import { createConverter } from "convert-svg-to-png"
// import { promisify } from "util"

// // const converter = createConverter()

// // add dirt to the emojis lol
// emojis.dirt = { emoji: require("../bot/lib/emoji.json").dirt }

// ;(async () => {
//   const writeFile = promisify(fs.writeFile)
//   for (const emoji in emojis) {

//     console.log(emoji, emojis[emoji].emoji)

//     const url = twemoji.parse(emojis[emoji].emoji, {
//       folder: "svg",
//       ext: ".svg"
//     }).match(/https.*\.svg/)[0]

//     console.log(url)

//     const res = await fetch(new URL(url))
//     const body = await res.text()
//     await writeFile(`./bot/images/svg/${emoji}.svg`, body)
//     console.log(`${emoji}.svg`, "Saved!")
//   }
// })().then(() => {
//   console.log("converting")
//   convertSvgFiles("./bot/images/svg")
// })

// async function convertSvgFiles(dirPath) {
//   const converter = createConverter()
//   const readdir = promisify(fs.readdir)

//   try {
//     const filePaths = await readdir(dirPath/* , (err, files) => { console.log(files) } */)
//     console.log("filePaths:", filePaths)

//     for (const filePath of filePaths) {
//       await converter.convertFile(`./bot/images/svg/${filePath}`, {
//         height: 150,
//         width: 150,
//         outputFilePath: `./bot/images/png/${filePath.split(".")[0]}.png`
//       })
//     }
//   } finally {
//     await converter.destroy()
//   }
// }

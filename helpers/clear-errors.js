const fs = require("fs")
const path = require("path")

const directory = "./bot/logs/errors"

fs.readdir(directory, (error, files) => {
  if (error) { throw error }

  for (const file of files) {
    process.stdout.write(`Deleting ${file}...\r`)
    fs.unlink(path.join(directory, file), (err) => {
      if (err) { throw err }
    })
  }
})
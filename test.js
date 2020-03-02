const { Cooldowns } = require("./bot/lib/classes.js")

// const e = new UserCoolDowns(1234567890)
// console.log(e)

const f = new Cooldowns()
f.check("295255543596187650", "plots")
f.check("295255543596187623", "seeds")
console.log("f1:", f)
f.check("295255543596187948", "buy")
console.log("f2:", f)

console.log(f.check("295255543596187623", "ping"))
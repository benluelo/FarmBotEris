import { Farmer } from "./npc"
import fetch from "node-fetch"
import { transliterate as tr } from "transliteration"
import { CropDatas, CropInfo } from "./crop-data"

export const run = async (region: string) => {

  const randArray = new Array(11).fill(undefined).map(() => Math.random()).sort()
  const fruitsArray = <CropInfo.CropName[]>Object.keys(CropDatas).filter((name) => "apple" != name)
  const farmers: Farmer[] = []
  const data = await fetch(new URL(`https://uinames.com/api/?amount=${11}&region=${region}`))
  const json = await data.json()
  json.forEach((element: { name: string; surname: string; gender: "male" | "female" }) => {
    farmers.push(new Farmer(tr(element.name + " " + element.surname), element.gender, fruitsArray.shift(), randArray.shift()))
  })
  return farmers
}
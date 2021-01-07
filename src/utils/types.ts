export type Territory = {
  abbreviation: string
  name: string
  active: boolean
  data: TerritoryData[]
}

export type TerritoryData = {
  date: number | string
  positiveIncrease: number
  negativeIncrease: number
}

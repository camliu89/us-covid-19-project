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

export type DataPoints = {
  id: string
  color: string
  show: boolean
  name: string
}

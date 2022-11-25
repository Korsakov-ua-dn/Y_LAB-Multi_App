import { getRandomInt } from "./getRandomInt"
import getTime from "./getTime"

export const getShape = (dpi_width: number, dpi_height: number, zoom: number, offset: number[]) => {
    let coords = new Array(getRandomInt(3, 3))
    .fill(0)
    .map(() => getPoint(dpi_width, dpi_height, zoom, offset))

  return {
    type: 'line',
    color: `#${getRandomInt(111111, 999999)}`,
    lineWidth: 10,
    now: getTime(),
    coords,
    polygon: coords,
    fallHeight: 0,
    h: 0,
    l: 0,
    isActive: false,
    isStop: false,
  }
}

 // Генерирует точку в пределах верхней половины области видимости с отступом 50px
const getPoint = (dpi_width: number, dpi_height: number, zoom: number, offset: number[]) => [
  getRandomInt(-50 / zoom, dpi_width / zoom - 50 * zoom ) + offset[0] / zoom , // координата по X 
  getRandomInt(-50 / zoom, dpi_height / 2 / zoom) + offset[1] / zoom // координата по Y (больше 50px && < половины высоты canvas)
]

// types
export type ShapeType = ReturnType<typeof getShape> 
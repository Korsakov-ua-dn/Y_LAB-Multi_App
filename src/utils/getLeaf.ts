import { getRandomInt } from "./getRandomInt"
import getTime from "./getTime"

export const getLeaf = (dpi_width: number, dpi_height: number, zoom: number, offset: number[], images: HTMLImageElement[]) => {
  const image = images[getRandomInt(0, images.length - 1)];
  let x = getRandomInt(-50 / zoom, dpi_width / zoom - 50 * zoom ) + offset[0] / zoom; // координата по X 
  let y = getRandomInt(-200 / zoom, 0 - image.height / zoom) + offset[1] / zoom; // координата по Y (больше 50px && < половины высоты canvas)
  let crop = getRandomInt(5, 10)/10;
  const width = image.width * crop
  const height = image.height * crop
  const coords = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ]

  return {
    type: 'leaf',
    color: `rgba(0, 0, 0, 0)`,
    now: getTime(),
    image,
    crop,
    x,
    y,
    width,
    height,
    coords,
    fallHeight: 0,
    polygon: coords,
    vo: crop + Math.random()/10,
    dl: getRandomInt(-10, 10) * crop, // random offset on the x axis
    da: getRandomInt(-3, 3),
    a: getRandomInt(-1, 1),
    isActive: false,
    isStop: false,
    h: 0,
    l: 0,
  }
}

// types
export type LeafType = ReturnType<typeof getLeaf> 

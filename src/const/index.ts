// export const ENUMS = {
//   popup: {
//     basket: "basket",
//     addToBasket: "add-to-basket",
//     catalog: "catalog",
//   },
//   leaves: ["leaf1", "leaf2", "leaf3", "leaf4", "leaf5"],
// }

export enum Popups {
  BASKET=  "basket",
  ADDTOBASKET= "add-to-basket",
  CATALOG= "catalog",
}

export enum Leaves {
  leaf1,
  leaf2,
  leaf3,
  leaf4,
  leaf5,
}

    // график по точкам
    // contextRef.current.beginPath()
    // contextRef.current.lineWidth = 4
    // contextRef.current.strokeStyle = '#ff0000'
    // for (const [x, y] of data) {
    //   contextRef.current.lineTo(x, dpi_height - y)
    // }
    // contextRef.current.stroke()
    // contextRef.current.closePath()

    // прямоугольник
    // contextRef.current.beginPath()
    // contextRef.current.lineWidth = 4
    // contextRef.current.fillStyle = '#ff0000'
    // contextRef.current.strokeRect(50, 50, 300, 200)

    // круг
    // contextRef.current.beginPath()
    // contextRef.current.lineWidth = 4
    // contextRef.current.strokeStyle = '#ff0000'
    // contextRef.current.arc(dpi_width /  2, dpi_height / 2, 150, 0, Math.PI * 2)
    // contextRef.current.stroke();

import StateModule from "@src/store/module";
import { LeafType } from "@src/utils/getLeaf";
import { getRandomInt } from "@src/utils/getRandomInt";
import { ShapeType } from "@src/utils/getShape";
import getTime from "@src/utils/getTime";

/**
 * Чат
 */
class CanvasState extends StateModule {

  initState() {
    return {
      entitys: [] as EntityType[],
      current: null as EntityType | null,
      canvasSize: {
        dpi_width: null as number | null,
        dpi_height: null as number | null,
        dpr: 1,
      },
      offset: [0, 0], // x, y
      zoom: 1,
    }
  }

  setSize(canvasSize: {
    dpi_width: number | null,
    dpi_height: number | null,
    dpr: number,
  }): void {
    this.setState({
      ...this.getState(),
      canvasSize,
    });
  }

  setEntity(entity: EntityType): void {
    this.setState({
      ...this.getState(),
      entitys: [
        ...this.getState().entitys,
        entity
      ],
    });
  }

  setHeight(entity: EntityType): void {
    this.setState({
      ...this.getState(),
      entitys: this.getState().entitys.map( e => e === entity ? {
        ...entity,
      } : e ),
    }, ``);
  }

  setisActive(entity: EntityType): void {
    this.setState({
      ...this.getState(),
      entitys: this.getState().entitys.map( e => e === entity 
        ? {...e, isActive: true, isStop: true, coords: e.coords.map(([x, y]) => [x + e.l ,  y + e.h])}   
        : {...e, isActive: false, isStop: false} ),
    }, ``);
  }

  move(): void {
    this.setState({
      ...this.getState(),
      entitys: this.getState().entitys.map( e => e.isStop
        ? {...e, isStop: false, now: getTime()}
        : e ),
    });
  }

  clean(): void {
    this.setState({
      ...this.getState(),
      entitys: [],
      fall: [],
      offset: [0, 0],
      zoom: 1,
    });
  }

  addOffset({x, y, dx, dy}: {x?: number, y?: number, dx?: number, dy?: number}): void {
    this.setState({
      ...this.getState(),
      offset: [
        x ? x : this.getState().offset[0] + dx, 
        y ? y : this.getState().offset[1] + dy,
      ],
    });
  }

  changeCoords(coords: Array<number[]>): void {
    this.setState({
      ...this.getState(),
      entitys: this.getState().entitys.map( e => e.isActive ? {
        ...e, 
        coords,
        now: getTime(),
      } : e ),
    });
  }

  newTime(entity: LeafType): void {
    this.setState({
      ...this.getState(),
      entitys: this.getState().entitys.map( e => e === entity 
        ? {
            ...e, 
            now: getTime(), 
            h: 0,
            a: entity.a, 
            da: entity.da,
            dl: getRandomInt(-10, 10) * entity.crop, 
            vo: entity.crop + Math.random()/10,
          }   
        : {...e}),
    }, ``);
  }

  addZoom(zoom: number, offset: number[]): void {
    this.setState({
      ...this.getState(),
      zoom,
      offset,
    });
  }

}

export default CanvasState;

// types
export type EntityType = ShapeType | LeafType

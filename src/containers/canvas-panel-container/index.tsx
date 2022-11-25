import React, { useCallback, useEffect, useLayoutEffect, useState, ChangeEvent } from 'react';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import CanvasPanel from '@src/components/canvas-panel';
import { Leaves } from '@src/const';
import { RootStateType } from '@src/store';
import { getShape } from '@src/utils/getShape';
import { getLeaf } from '@src/utils/getLeaf';
import { EntityType } from '@src/store/canvas';

type PropsType = {
  ctx: CanvasRenderingContext2D | null,
}

const CanvasPanelContainer:React.FC<PropsType> = (props) => {
  
  const store = useStore();

  const select = useSelector((state: RootStateType) => ({
    entitys: state.canvas.entitys,
    canvasSize: state.canvas.canvasSize,
    offset: state.canvas.offset,
    zoom: state.canvas.zoom,
  }));
  
  let active = select.entitys.filter((e: EntityType) => e.isActive)[0]

  const [value, setValue] = useState<string>(''); // set active shape coordinat for input
  const [images, setImages] = useState<HTMLImageElement[]>();

  const callbacks: CallbacksType = {

    // Добавить сущность в стейт
    addEntity: useCallback(() => {
      const entity = getShape(select.canvasSize.dpi_width, select.canvasSize.dpi_height, select.zoom, select.offset)
      store.get('canvas').setEntity(entity)
    }, [select.canvasSize, select.zoom, select.offset]),

    // Добавить лист в стейт
    addLeaf: useCallback(() => {
      const leaf = getLeaf(select.canvasSize.dpi_width, select.canvasSize.dpi_height, select.zoom, select.offset, images)
      store.get('canvas').setEntity(leaf)
    }, [select.canvasSize, select.zoom, select.offset, images]),

    // Очистить холст
    clear: useCallback(() => {
      store.get('canvas').clean()
      props.ctx.fillStyle = '#ffffff'
      setValue('')
      props.ctx.fillRect(0, 0, select.canvasSize.dpi_width, select.canvasSize.dpi_height)
    }, [props.ctx]),

    // 
    changeCoords: useCallback(() => store.get('canvas').changeCoords(JSON.parse(value).map(([x, y]) => [
      x * select.canvasSize.dpr, 
      (y + active.h) * select.canvasSize.dpr,
    ]))
    , [value, active]),

    // 
    setValue: useCallback(e => setValue(e.target.value)
    , []),

    // 
    loadImage: useCallback(src => new Promise((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
    })
    , []),

  };

  // Async load image of leaves => set it to local state
  useLayoutEffect(() => {

    (async function() {

      const images = [];

      for ( let name in Leaves ) {
        if (isNaN(Number(name))) {
          const img = await callbacks.loadImage(require(`@src/assets/img/canvas/${name}.png`))
          images.push(img)
        }
      }

      setImages(images)
    })()
    
  }, [])

  // Correct active shape coordinat for input
  useEffect(() => {
    const data = active?.coords.map(([x, y]) => [
      Math.round(x + active.l / select.canvasSize.dpr), 
      Math.round((y + active.h) / select.canvasSize.dpr)
    ])
    setValue(JSON.stringify(data)?.replaceAll(",", ", "))
  }, [active, select.canvasSize.dpr])

  return (
    <CanvasPanel  addEntity={callbacks.addEntity}
                  addLeaf={callbacks.addLeaf}
                  clear={callbacks.clear}
                  value={value}
                  setValue={callbacks.setValue}
                  onBlur={callbacks.changeCoords}
                  />
  )
}

export default React.memo(CanvasPanelContainer);

//types
type CallbacksType = {
  addEntity: () => void,
  addLeaf: () => void,
  clear: () => void,
  changeCoords: () => void,
  setValue: (e: ChangeEvent<HTMLInputElement>) => void,
  loadImage: (src: string) => Promise<HTMLImageElement>
}



import React, { useCallback, useEffect, useRef, useState } from "react";
import useSelector from "@src/hooks/use-selector";
import Canvas from "@src/components/canvas";
import useStore from "@src/hooks/use-store";
import throttle from "lodash.throttle";
import pp from 'robust-point-in-polygon';
import getTime from "@src/utils/getTime";
import { getRandomInt } from "@src/utils/getRandomInt";
import { EntityType } from "@src/store/canvas";

function CanvasContainer({ canvasRef, ctx }) {
  const store = useStore();
  
  const select = useSelector(state => ({
    entitys: state.canvas.entitys,
    offset: state.canvas.offset,
    zoom: state.canvas.zoom,
    canvasSize: state.canvas.canvasSize,
  }));

  const [base, setBase] = useState(null) // set mouse down event coordinates
  const activeShape = useRef<EntityType>() //@todo types

  const callbacks = {

    // Check is entity inscribed in a square in scope
    checkIsView: useCallback((coords) => {
      const minW = 0 + select.offset[0] / select.zoom
      const maxW = (select.canvasSize.dpi_width / select.zoom) + select.offset[0] / select.zoom
      const minH = 0 + select.offset[1] / select.zoom
      const maxH = (select.canvasSize.dpi_height / select.zoom) + select.offset[1] / select.zoom

      let viewXmin = false
      let viewXmax = false
      let viewYmin = false
      let viewYmax = false

      for (let i = 0; i < coords.length; i++) {
        if (coords[i][0] >= minW) {
          viewXmin = true
        }
        if (coords[i][0] <= maxW) {
          viewXmax = true
        }
        if (coords[i][1] >= minH ) {
          viewYmin = true
        }
        if (coords[i][1] <= maxH) {
          viewYmax = true
        }
      }

      // console.log(viewXmin, viewXmax, viewYmin, viewYmax);
      return viewXmin && viewXmax && viewYmin && viewYmax
    }, [select.canvasSize, select.offset, select.zoom]),

    onWheel: useCallback(e => {
      if (e.shiftKey) {
        callbacks.zoom({
          delta: e.deltaY > 0 ? -0.1 : 0.1, 
          center: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        });
      } else {
        store.get('canvas').addOffset({
          dx: 0, 
          dy: e.deltaY > 0 ? 50 * select.canvasSize.dpr : -50 * select.canvasSize.dpr
        }) // dx, dy
      }
    }, [select.zoom, select.offset, select.canvasSize.dpr]),

    //
    zoom: useCallback(({delta, center}) => {

      const centerOld = {
        x: center.x + select.offset[0],
        y: center.y + select.offset[1]
      };
      
      const centerReal = {
        x: centerOld.x / select.zoom,
        y: centerOld.y / select.zoom
      }

      let newZoom = select.zoom + delta * select.zoom;
      newZoom = Math.max(0.05, newZoom);
  
      const centerNew = {
        x: centerReal.x * newZoom,
        y: centerReal.y * newZoom
      }

      const offset = [
        centerNew.x - center.x,
        centerNew.y - center.y,
      ]

      store.get('canvas').addZoom(newZoom, offset)
    }
    , [ctx, select.offset, select.zoom]),

    //
    onMouseDown: useCallback(e => {
      setBase([e.clientX, e.clientY])
      if (select.entitys.length) {
        for (let i = select.entitys.length - 1; i >= 0; i--) {

          if (callbacks.isPointInPoly(select.entitys[i].coords, select.entitys[i].h, select.entitys[i].l, [e.nativeEvent.offsetX, e.nativeEvent.offsetY])) {
            activeShape.current = select.entitys[i]
            store.get('canvas').setisActive(select.entitys[i])
            return;
          }

        }
      }

    }, [select.entitys, select.offset, select.zoom]),

    //
    onMouseUp: useCallback(() => {
      setBase(null) // clear coordinates
      activeShape.current = null
      store.get('canvas').move()
    }, []),

    //
    onMouseMove: useCallback(e => {
      if (activeShape.current) {

        const newCoords = activeShape.current.coords.map(([x, y]) => [
          x + (e.clientX - base[0]) / select.zoom * select.canvasSize.dpr + activeShape.current.l, 
          y + (e.clientY - base[1]) / select.zoom * select.canvasSize.dpr + activeShape.current.h
        ])

        store.get('canvas').changeCoords(newCoords)

      } else {

        base && store.get('canvas').addOffset({
          x: (select.offset[0] - (e.clientX - base[0])) * select.canvasSize.dpr, 
          y: (select.offset[1] - (e.clientY - base[1])) * select.canvasSize.dpr
        }) // x, y

    }
        
    }, [ctx, select.canvasSize, base, select.zoom, select.canvasSize.dpr]), // dependencies should not be offset

    // setHeight with throttle
    setHeight: useCallback(
      throttle((entity) => store.get('canvas').setHeight(entity), 100)
    , []),

    // newTime with throttle
    newTime: useCallback( 
      throttle((entity) => store.get('canvas').newTime(entity), 100)
    , []),

    // 
    isPointInPoly: useCallback( (poly, h, l, [x, y]) => {
      let newPoly = poly.map(([x, y]) => [x * select.zoom , y * select.zoom])
      return pp(newPoly, 
      [
        x + select.offset[0] - l * select.zoom, 
        y + select.offset[1] - h * select.zoom
      ]
      ) === -1
    }
    , [select.zoom, select.offset, select.canvasSize]),

    // animate shape
    animate: useCallback((entity) => {
      let maxY = -Infinity;
      entity.coords.forEach(c => maxY = c[1] > maxY ? c[1] : maxY) // if stroke => -1/2 lineWidth
      let fallHeight = select.canvasSize.dpi_height - maxY + (entity.image?.height || 0)
      let t = getTime()
      let h = ( 10 * (entity.vo || 1) * (t - entity.now)**2 ) / 2
      h = h > fallHeight ? fallHeight : Math.ceil(h)
      let l = (t - entity.now)**2 / 6 * entity.dl || 0
      l = Math.ceil(l)
      if (Math.random() < 0.02) entity.da = getRandomInt(-3, 3);
      if (entity.isStop) { 
        h = 0
        l = 0
      }
      entity.fallHeight = fallHeight
      entity.h = h
      entity.l = l
      entity.a += entity.da
      entity.polygon = entity.coords.map(([x, y]) => [x + entity.l * select.zoom ,  y + entity.h * select.zoom])
    }, [select.canvasSize.dpi_height]),

    // render shape
    render: useCallback((ctx, entity) => {
      const { type, polygon, color, lineWidth, isActive } = entity;
      ctx.save();
      ctx.translate(
        polygon[0][0] * select.zoom + ((entity.width / 2) * select.zoom) - select.offset[0], 
        polygon[0][1] * select.zoom + ((entity.height / 2) * select.zoom) - select.offset[1]
      );
      ctx.rotate(entity.a / 5 * Math.PI / 180 );
      ctx.translate(
        -(polygon[0][0] * select.zoom + ((entity.width / 2) * select.zoom) - select.offset[0]),
        -(polygon[0][1] * select.zoom + ((entity.height / 2) * select.zoom) - select.offset[1])
      );

      ctx.beginPath()
      ctx.moveTo(
        polygon[0][0] * select.zoom - select.offset[0], 
        polygon[0][1] * select.zoom - select.offset[1] 
      )
      for (let i = 1; i < polygon.length; i++) {
        ctx.lineTo(
          polygon[i][0] * select.zoom - select.offset[0], 
          polygon[i][1] * select.zoom - select.offset[1] 
        )
      }
      ctx.closePath()
      ctx.lineWidth = lineWidth * select.zoom
      ctx.fillStyle = isActive && type !== "leaf" ? '#ff0000' : color
      ctx.fill();
      
      type === "leaf" && ctx.drawImage(
        entity.image, 
        polygon[0][0] * select.zoom - select.offset[0], 
        polygon[0][1] * select.zoom - select.offset[1], 
        entity.width * select.zoom, 
        entity.height * select.zoom
      );
      ctx.restore();
    }, [select.zoom, select.offset]),

  };

  // render all entitys from state
  useEffect(() => {

    let raf = requestAnimationFrame(function go() {
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, select.canvasSize.dpi_width, select.canvasSize.dpi_height) // clear canvas
      }

      select.entitys.forEach(entity => {

        callbacks.animate(entity)

        if (callbacks.checkIsView(entity.polygon) || entity.type === "leaf") {
            callbacks.render(ctx, entity)
            entity.h !== entity.fallHeight && callbacks.setHeight(entity)
            entity.h === entity.fallHeight && entity.type === "leaf" && callbacks.newTime(entity)
        }

      })

      raf = requestAnimationFrame(go)
    })

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [ctx, select.entitys, select.offset, select.zoom])

  // dragging outside the canvas
  useEffect(() => {
    window.addEventListener("mousemove", callbacks.onMouseMove)
    window.addEventListener("mouseup", callbacks.onMouseUp)

    return () => {
      window.removeEventListener("mousemove", callbacks.onMouseMove)
      window.removeEventListener("mouseup", callbacks.onMouseUp)
    }
  }, [callbacks.onMouseMove, callbacks.onMouseUp])


  return (
    <Canvas ref={canvasRef}
            onWheel={callbacks.onWheel}
            onMouseDown={callbacks.onMouseDown}
            />
  )
}

export default React.memo(CanvasContainer);

import React, { useEffect, useRef, useState } from "react";
import CanvasContainer from "../../containers/canvas-container";
import CanvasPanelContainer from "../../containers/canvas-panel-container";
import useStore from "../../hooks/use-store";
// import useStore from "@src/hooks/use-store";
// import CanvasContainer from "@src/containers/canvas-container";
// import CanvasPanelContainer from "@src/containers/canvas-panel-container";

function CanvasPage(){
  const store = useStore();

  const canvasRef = useRef<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {

    if (canvasRef.current) {
      setCtx(canvasRef.current.getContext('2d', {alpha: false}))
      const dpr = 1
      const dpi_width = canvasRef.current.clientWidth * dpr
      const dpi_height = canvasRef.current.clientHeight * dpr
      canvasRef.current.width = dpi_width
      canvasRef.current.height = dpi_height
      //@ts-ignore
      canvasRef.current.imageSmoothingEnabled = false
      store.get('canvas').setSize({dpi_width, dpi_height, dpr})
    }

  }, [])

  return (
    <>
      <CanvasPanelContainer ctx={ctx} />
      <CanvasContainer  canvasRef={canvasRef}
                        ctx={ctx}
                        />
    </>
  )
}

export default React.memo(CanvasPage);

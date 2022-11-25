import React, {WheelEvent, MouseEvent} from 'react';
// import propTypes from "prop-types";
import {cn as bem} from "@bem-react/classname";
import './style.css';

type PropsType = {
  onWheel: (e: WheelEvent<HTMLCanvasElement>) => void,
  onMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void,
}

const Canvas = React.forwardRef<HTMLCanvasElement, React.PropsWithChildren<PropsType>>((props, ref) => {
  const cn = bem('Canvas');

  return (
    <canvas className={cn()} 
            ref={ref} 
            id="canvas"
            onWheel={props.onWheel}
            onMouseDown={props.onMouseDown}
            >
    </canvas>
  )
})

// Canvas.propTypes = {
//   onWheel: propTypes.func.isRequired,
//   onMouseDown: propTypes.func.isRequired,
// }

// Canvas.defaultProps = {
// }

export default React.memo(Canvas);

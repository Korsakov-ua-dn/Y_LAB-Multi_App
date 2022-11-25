import React, {ChangeEvent} from 'react';
// import propTypes from "prop-types";
import {cn as bem} from "@bem-react/classname";
import './style.css';

type PropsType = {
  addEntity: () => void,
  addLeaf: () => void,
  clear: () => void,
  value: string,
  setValue: (e: ChangeEvent<HTMLInputElement>) => void,
  onBlur: () => void,
}

const CanvasPanel:React.FC<PropsType> = ({addEntity, addLeaf, clear, value, setValue, onBlur}) => {
  
  const cn = bem('Canvas-panel');

  return (
    <div className={cn()}>

        <button className={cn('button')}
                onClick={addEntity}
        >Добавить фигуру</button>

        <button className={cn('button')}
                onClick={addLeaf}
        >Добавить лист</button>

        <button className={cn('button')}
                onClick={clear}
        >Очистить поле</button>

        <input  className={cn('params')}
                value={value || []}
                onBlur={onBlur}
                onChange={setValue}
        />
        

    </div>
  )
}

// CanvasPanel.propTypes = {
//   addEntity: propTypes.func.isRequired,
//   addLeaf: propTypes.func.isRequired,
//   clear: propTypes.func.isRequired,
//   value: propTypes.string,
//   setValue: propTypes.func.isRequired,
//   onBlur: propTypes.func.isRequired,
// }

// CanvasPanel.defaultProps = {
//   value: '',
// }

export default React.memo(CanvasPanel);

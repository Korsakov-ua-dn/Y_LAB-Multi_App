import React, { useCallback, useEffect, useRef, useState } from 'react';
import propTypes from "prop-types";
import {cn as bem} from "@bem-react/classname";
import './style.css';

const ChatList = React.forwardRef((props, ref) => {
  const cn = bem('ChatList');

  const [text, setText] = useState('');

  const callbacks = {
    // Отправить сообщение
    send: useCallback(() =>{ 
      props.send(text)
      setText('')
    }, [text]),
  };

  return (
    <div className={cn()}>

      <div className={cn('messages-wrapper')} onScroll={props.onScroll}>
        { props.messages.map( (m, i) => props.renderFunc(m, i)) }
        <div ref={ref}/>
      </div>
      
      <div className={cn('form')}>
        <textarea className={cn('field')}
                  rows="5"
                  cols="30"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  />
        <button className={cn('button-send')}
                onClick={callbacks.send}
                // disabled={props.wsStatus !== 'ready'}
        >Отправить
        </button>
      </div>

    </div>
  )
})

ChatList.propTypes = {
  messages: propTypes.array.isRequired,
  send: propTypes.func.isRequired,
  renderFunc: propTypes.func.isRequired,
  // wsStatus: propTypes.string.isRequired,
}

ChatList.defaultProps = {
}


export default React.memo(ChatList);

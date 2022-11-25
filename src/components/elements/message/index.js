import React from 'react';
import propTypes from "prop-types";
import {cn as bem} from "@bem-react/classname";
import './style.css';
import ava from "@src/assets/img/logo.png"
import delivered from "@src/assets/img/delivered.png"

const Message = React.forwardRef((props, ref) => {
  const cn = bem('Message');

  return (
    <div  className={`${cn()} ${props.my ? cn('my') : ''}`}
          ref={ref}
          >
      <img  className={cn('avatar')} 
            src={ava} 
            alt="photo"
            width={50}
            height={50}
            />
      <div className={cn('wrapper')}>
        <div>
          <span className={cn('user')}>{props.m.author.profile.name}</span>
          <span className={cn('date')}>{props.m.dateCreate}</span>
        </div>
        <span className={cn('text')}>{props.m.text}</span>
      </div>
      { 
        props.m.dateCreate && <img  className={cn('delivered')} 
              src={delivered} 
              alt="delivered"
              width={15}
              height={15}
              />
      }
    </div>
  )
})

Message.propTypes = {
  m: propTypes.object.isRequired,
}

Message.defaultProps = {
}

export default React.memo(Message);

import React from 'react';
import propTypes from 'prop-types';
import './styles.css';

function Qty({ onOk, onUp, onDown, value, callToAction }) {
  return (
    <div className="Qty">
      <span className='Qty-call'>{callToAction}</span>
      <div className='Qty-panel'>
        <span className='Qty-amount'>
          <i onClick={onUp} className='Qty-up'/>
          {value}
          <i onClick={onDown} className='Qty-down'/>
        </span>
        <button onClick={onOk}>Ok</button>
      </div>
    </div>
  )
}

Qty.propTypes = {
  onOk: propTypes.func,
  onUp: propTypes.func,
  onDown: propTypes.func,
  value: propTypes.number.isRequired,
}

Qty.defaultProps = {
  onOk: () => {},
}

export default React.memo(Qty);

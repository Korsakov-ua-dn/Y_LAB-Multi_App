import React, {useCallback} from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import './style.css';

function ItemPopup(props) {
  const cn = bem('ItemPopup');

  const callbacks = {
    onSelect: useCallback(() => { 
      props.onSelect(props.item._id)
    }, [props.onSelect, props.item])
  };

  return (
    <div onClick={callbacks.onSelect} className={`${cn()} ${props.selected?.includes(props.item._id) ? cn() + "-selected" : ""}`}>
      <div className={cn('title')}>
        { props.item.title }
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
      </div>
    </div>
  )
}

ItemPopup.propTypes = {
  item: propTypes.object.isRequired,
  onSelect: propTypes.func,
  labelCurr: propTypes.string,
}

ItemPopup.defaultProps = {
  onSelect: () => {},
  labelCurr: '₽',
}

export default React.memo(ItemPopup);

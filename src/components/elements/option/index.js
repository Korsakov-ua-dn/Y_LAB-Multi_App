import React from 'react';
import propTypes from "prop-types";
import './style.css';

import {cn as bem} from '@bem-react/classname';

function Option({
  title,
  code,
  filteredOptions,
  onClick,
  selectedCountry,
  currentRef,
}) {
  const cn = bem('Option');

  const classN = `
  ${title == filteredOptions[selectedCountry]?.title ? cn("selected") : "" } 
  ${cn('')}
`
  return (
    <li className={classN}
        ref={currentRef} 
        data-title={title}
        onClick={onClick} // @todo one callback for all li
        >
      <span data-code={code} className={cn('item')}>{title}</span>
    </li>
  )
}
        
Option.propTypes = {
  title: propTypes.string.isRequired,
  code: propTypes.string,
  filteredOptions: propTypes.array.isRequired,
  onClick: propTypes.func.isRequired,
  selectedCountry: propTypes.number.isRequired,
  currentRef: propTypes.object,
}

Option.defaultProps = {
}

export default React.memo(Option);

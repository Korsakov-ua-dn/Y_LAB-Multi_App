import React from 'react';
import propTypes from 'prop-types';
import './styles.css';

function OpenCatalog({ onOpen }) {
  return (
    <div className="OpenCatalog">
      <button onClick={onOpen}>Каталог</button>
    </div>
  )
}

OpenCatalog.propTypes = {
  onOpen: propTypes.func
}

OpenCatalog.defaultProps = {
  onOpen: () => {},
}

export default React.memo(OpenCatalog);

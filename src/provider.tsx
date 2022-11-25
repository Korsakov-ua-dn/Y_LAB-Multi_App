import React from 'react';
import propTypes from "prop-types";
import Services from './services';

/**
 * Контекст для Services
 * @type {React.Context<{}>}
 */
export const ServicesContext: React.Context<Services | {}> = React.createContext({});

type PropsType = {
  services: Services,
  children: React.ReactNode | React.ReactNode[]
}

/**
 * Провайдер Services.
 */
function ServicesProvider({services, children}: PropsType) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

ServicesProvider.propTypes = {
  services: propTypes.object.isRequired,
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node
  ]).isRequired,
}

export default React.memo(ServicesProvider);

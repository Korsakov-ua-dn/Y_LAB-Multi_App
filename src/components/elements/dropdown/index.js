import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import propTypes from "prop-types";
import './style.css';

import {cn as bem} from '@bem-react/classname';
import Option from '../option';

function Dropdown({
  options,
  filteredOptions,
  setDropdownOpen,
  setSelectedCountry,
  setSearch,
  selectRef,
  selectedCountry,
  search,
  width,
}){
  const cn = bem('Dropdown');
  const currentRef = useRef();
  const [ selectPosition, setSelectPosition ] = useState({});

  const callbacks = {
    onSelect: useCallback((e) => {
      setDropdownOpen(false)
      selectRef.focus() // фокус на select после закрытия dropdown list
      // сетаем индекс элемента в неотфильтрованном массиве
      setSelectedCountry(options.findIndex(el => el.title === e.currentTarget.getAttribute('data-title')))
    }, [setDropdownOpen, setSelectedCountry]),
    onSearch: useCallback((e) => {
      setSelectedCountry(0)
      setSearch(e.target.value)
    }, []),
    windowKeyDownHandler: useCallback(
      (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          !!currentRef.current && currentRef.current.scrollIntoView({block: "end"}) // скролл внутри dropdown
        } 
      }, [setDropdownOpen, setSelectedCountry]),
    onScroll: useCallback(() => setDropdownOpen(false), []),
    onClickSearch: useCallback((e) =>  e.stopPropagation(), []), // предотвращает событие закрытия модалки на window
    searchKeyDownHandler: useCallback((e) => {
      switch (e.key) {
        case "Enter":
          setDropdownOpen(false);
            // сетаем индекс элемента в неотфильтрованном массиве
          selectRef.focus() // фокус на select после закрытия dropdown list
          setSelectedCountry(options.findIndex(el => el.title === filteredOptions[selectedCountry]?.title))
          break;
        case "Tab":
        case "Escape": 
          setDropdownOpen(false)
          selectRef.focus() // фокус на select после закрытия dropdown list
          break;
        case "ArrowDown": 
          e.preventDefault(); // предоивращает прокрутку скролла на странице помимо dropdown list
          setSelectedCountry((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp": 
          e.preventDefault(); // предоивращает прокрутку скролла на странице помимо dropdown list
          setSelectedCountry((prev) => (!!prev ? prev - 1 : prev));
          break;
      }
    }, [filteredOptions.length, selectedCountry, setDropdownOpen, setSelectedCountry]),
  }

  useEffect(() => {
    !!currentRef.current && currentRef.current.scrollIntoView({block: "end"}) // скролл к активному элементу списка

    filteredOptions.length && window.addEventListener("keydown", callbacks.windowKeyDownHandler);
    return () => {
      window.removeEventListener("keydown", callbacks.windowKeyDownHandler);
    };
  }, [filteredOptions.length, callbacks.windowKeyDownHandler]);
  
  useLayoutEffect(() => {
    // положение select относительно экране
    const { top, left } = selectRef.getBoundingClientRect()
    setSelectPosition({top, left})

    window.addEventListener("scroll", callbacks.onScroll); // автоматическое сворачивание селекта при скролле по странице 
    return () => {
      window.removeEventListener("scroll", callbacks.onScroll); 
      setSearch('')
    }
  }, [])

  return (
    <div  className={cn()}
          style={{
            top: `${selectPosition?.top + 30}px`, 
            left: `${selectPosition?.left}px`, 
            maxWidth: `${width}px`
          }}>
     
      <input  className={cn('search')}
              value={search}
              onChange={callbacks.onSearch}
              onClick={callbacks.onClickSearch}
              onKeyDown={callbacks.searchKeyDownHandler}
              type="text" 
              placeholder="Поиск"
              />
      <ul className={cn('options')}>
      { 
        filteredOptions.map((item, i) => (
          <Option title={item.title}
                  code={item.code}
                  filteredOptions={filteredOptions}
                  onClick={callbacks.onSelect}
                  selectedCountry={selectedCountry}
                  currentRef={ i == selectedCountry ? currentRef : null }
                  key={i}
          />
        ))
      }
      </ul>
    </div>
  )
}
        
Dropdown.propTypes = {
  options: propTypes.array.isRequired,
  filteredOptions: propTypes.array.isRequired,
  setDropdownOpen: propTypes.func.isRequired,
  setSelectedCountry: propTypes.func.isRequired,
  setSearch: propTypes.func.isRequired,
  selectRef: propTypes.object.isRequired,
  selectedCountry: propTypes.number.isRequired,
  search: propTypes.string,
  width: propTypes.number,
}

Dropdown.defaultProps = {
}

export default React.memo(Dropdown);

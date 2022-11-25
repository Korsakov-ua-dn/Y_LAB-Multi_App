import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import propTypes from "prop-types";
import './style.css';

import {cn as bem} from '@bem-react/classname';
import { useMemo } from 'react';
import Dropdown from '../dropdown';

function SelecSearch({ onChange, value, options, width = 240 }){
  const cn = bem('SelectSearch');
  const selectRef = useRef();
  const wrapRef = useRef();
  const [isDropdown, setDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState();
  const [search, setSearch] = useState('');
  
  const filteredOptions = useMemo(() => {
    if (search) {
      const regex = new RegExp(`${search}`, 'i' )
      return options.filter(item => regex.test(item.title))
      // return options.filter(item => item.title.includes(search))
    } else return options
  }, [search, options])

  const callbacks = {
    toggleDropdown: useCallback(() => {
      // if (!SelecSearch.id) SelecSearch.id = e.currentTarget
      // if (SelecSearch.id !== selectRef.current) {
      //   SelecSearch.id = e.currentTarget
      // }
      // e.stopPropagation(); // предотвращает событие закрытия модалки на window => ломает переключение между разными SelectSerch
      setDropdownOpen(prev => !prev)
    }, []),
    // @todo необходимо отладить работу кнопок после добавления автофокусировки на search после открытия dropdown
    selectKeyDownHandler: useCallback((e) => {
      switch (e.key) {
        case "Enter": 
          !isDropdown && callbacks.toggleDropdown(e);
          break;
        case "Escape": 
          !isDropdown && callbacks.close()
          break;
        case " ": // "Space" handler
          e.preventDefault();
          !isDropdown && setDropdownOpen(true)
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
    }, [filteredOptions.length]),
    close: useCallback((e) => {
      if (!wrapRef.current.contains(e.target)) {
        setDropdownOpen(false)
      } // решение без использования SelecSearch.id
      // if (SelecSearch.id !== selectRef.current) {
      //   setDropdownOpen(false)
      // }
    }, []),
    // onChange: useCallback((num) => {
    //   // console.log(options);
    //   // console.log(selectedCountry);
    //   setSelectedCountry(num)
    //   onChange(options[selectedCountry]?.value)
    // }, [selectedCountry]),
  }

  useEffect(() => {
    window.addEventListener("click", callbacks.close);
    return () => {
      window.removeEventListener("click", callbacks.close);
    }
  }, [])

  // Обработка props.onChange
  useEffect(() => {
    if (!isDropdown) {
      onChange(options[selectedCountry]?.value)
    }
  }, [selectedCountry, isDropdown])

  // Для обратной совместимости с другим селектом отвечающим за те же данные
  useLayoutEffect(() => {
    const res = options.findIndex(el => el.value === value)
    res >= 0 && setSelectedCountry(options.findIndex(el => el.value === value))
  }, [value, options])

  return (
  <div  className={cn('wrapper')}
        style={{width: `${width}px`}}
        ref={wrapRef}
        >
    <div  className={cn()}
          style={{width: `${width}px`}}
          tabIndex={0}
          onBlur={() => {SelecSearch.id = null}}
          ref={selectRef}
          onClick={callbacks.toggleDropdown} 
          onKeyDown={callbacks.selectKeyDownHandler}
          >
      <span data-code={filteredOptions[selectedCountry]?.code} 
            className={'Option-item'}>
              {filteredOptions[selectedCountry]?.title}
      </span>
      <i className={cn('angle-down')}></i>
    </div>
      { isDropdown && <Dropdown setDropdownOpen={setDropdownOpen}
                                setSelectedCountry={setSelectedCountry}
                                // setSelectedCountry={callbacks.onChange}
                                setSearch={setSearch}
                                selectRef={selectRef.current}
                                selectedCountry={selectedCountry}
                                search={search}
                                options={options}
                                filteredOptions={filteredOptions}
                                width={width}
                                /> }
    </div>
  )
}

SelecSearch.propTypes = {
  onChange: propTypes.func.isRequired,
  value: propTypes.any,
  options: propTypes.array.isRequired,
  width: propTypes.number,
}

SelecSearch.defaultProps = {
  width: 240,
}

export default React.memo(SelecSearch);

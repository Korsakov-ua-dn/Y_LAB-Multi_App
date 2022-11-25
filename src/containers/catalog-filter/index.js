import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import Select from "@src/components/elements/select";
import SelectSearch from "@src/components/elements/select-search";
import Input from "@src/components/elements/input";
import LayoutFlex from "@src/components/layouts/layout-flex";
import {categories} from "@src/store/exports";
import listToTree from "@src/utils/list-to-tree";
import treeToList from "@src/utils/tree-to-list";

function CatalogFilter({ stateName = 'catalog' }) {

  const store = useStore();

  const select = useSelector(state => ({
    sort: state[stateName]?.params.sort,
    query: state[stateName]?.params.query,
    category: state[stateName]?.params.category,
    categories: state.categories.items,
    // countries: state.countries.items,
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => store.get(stateName).setParams({sort}), []),
    // Поиск
    onSearch: useCallback(query => store.get(stateName).setParams({query, page: 1}), []),
    // Сброс
    onReset: useCallback(() => store.get(stateName).resetParams(), []),
    // Фильтр по категории
    onCategory: useCallback(category => store.get(stateName).setParams({category, page: 1}), []),
  };

  // Опции для полей
  const options = {
    sort: useMemo(() => ([
      {value: 'order', title: 'По порядку'},
      {value: 'title.ru', title: 'По именованию'},
      {value: '-price', title: 'Сначала дорогие'},
      {value: 'edition', title: 'Древние'},
    ]), []),

    categories: useMemo(() => [
      {value: '', title: 'Все'},
      ...treeToList(
        listToTree(select.categories),
        (item, level) => ({value: item._id, title: '- '.repeat(level) + item.title})
      )
    ], [select.categories]),

    countries: useMemo(() => ([
        {title: "Россия", code: "RU"},
        {title: "Германия", code: "GD"},
        {title: "Чехия", code: "CH"},
        {title: "Франция", code: "FR"},
        {title: "Испания"},
        {title: "Бельгия", code: "BE"},
        {title: "Беларусь", code: "BY"},
        {title: "Бермуды", code: "BM"},
      ]), []),
  }

  return (
    <LayoutFlex flex="start" indent="big">
      <SelectSearch onChange={() => {}} options={options.countries}/>
      <Select onChange={callbacks.onCategory} value={select.category} options={options.categories}/>
      {/* <SelectSearch onChange={callbacks.onCategory} value={select.category} options={options.categories} width={160}/> */}
      {/* <Select onChange={callbacks.onSort} value={select.sort} options={options.sort}/> */}
      <SelectSearch onChange={callbacks.onSort} value={select.sort} options={options.sort} width={300}/>
      {/* <Input onChange={callbacks.onSearch} value={select.query} placeholder={'Поиск'} theme="big"/> */}
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </LayoutFlex>
  );
}

export default React.memo(CatalogFilter);

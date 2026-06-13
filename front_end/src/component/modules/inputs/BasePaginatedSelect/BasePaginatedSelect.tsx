import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { useState, useRef } from 'react';

type OptionType = {
  value: string;
  label: string;
};

interface Props {
  endpoint: string;
  placeholder?: string;
  onSelect: (option: OptionType | null) => void;
}

const BasePaginatedSelect = ({
  endpoint,
  placeholder = 'انتخاب کنید...',
  onSelect,
}: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<OptionType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFirstLoad = useRef(true);

  const fetchData = async (search: string, pageNum: number) => {
    const res = await axios.get(`${endpoint}?search=${search}&page=${pageNum}`);
    const results = res.data.results.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));
    setHasMore(Boolean(res.data.next));
    return results;
  };

  const loadOptions = async (searchValue: string) => {
    // اگر سرچ جدید باشه همه‌چیو ریست کن
    if (!isFirstLoad.current || searchValue !== inputValue) {
      isFirstLoad.current = false;
      setInputValue(searchValue);
      setPage(1);
      const newOptions = await fetchData(searchValue, 1);
      setOptions(newOptions);
      return newOptions;
    }

    // بار اول که mount شده
    const firstPage = await fetchData('', 1);
    setOptions(firstPage);
    return firstPage;
  };

  const handleScrollToBottom = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const nextOptions = await fetchData(inputValue, nextPage);
    setOptions((prev) => [...prev, ...nextOptions]);
    setPage(nextPage);
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      value={null}
      onChange={onSelect}
      placeholder={placeholder}
      isClearable
      onInputChange={(val) => {
        setInputValue(val);
        return val;
      }}
      onMenuScrollToBottom={handleScrollToBottom}
      options={options}
    />
  );
};
export default BasePaginatedSelect;

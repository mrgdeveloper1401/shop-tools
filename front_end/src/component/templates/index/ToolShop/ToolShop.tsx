'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Divider, Loader, LoadingOverlay, Tabs } from '@mantine/core';

import Breadcrumb from '@/component/modules/Breadcrumb/Breadcrumb';
import CardProduct from '../CardProduct/CardProduct';
import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';
import BaseSearchInput from '@/component/modules/inputs/BaseSearchInput/BaseSearch.input';
import {
  getProductsApi,
  getProductShopApi,
  IProducts,
  PaginationWithDataType,
} from '@/data/server_request/dashboard/product';
import s from './ToolShop.module.css';
import BaseSelectInput from '@/component/modules/inputs/BaseSelectInput/BaseSelect.input';
import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';

const filters = [
  { name: 'همه', filter: 'all' },
  { name: 'ارزان ترین', filter: 'price' },
  { name: 'گران ترین', filter: '-price' },
  { name: 'تخفیف دار', filter: 'has_discount' },
];

const ToolShop = () => {
  const urlParams = useSearchParams();
  const urlSearch = urlParams?.get('Search') || '';
  const urlTags = urlParams?.get('Tag') || '';
  const urlDiscount = urlParams?.get('has_Discount') || '';
  const urlPageIndex = urlParams?.get('page') || '1';
  const urlBrandId = urlParams?.get('brand_id');
  const urlCategoryId = urlParams?.get('category_id');

  const productSectionRef = useRef<HTMLDivElement>(null);

  const [allProductsData, setAllProductsData] =
    useState<PaginationWithDataType<IProducts>>();
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 0);
  const [filter, setfilter] = useState('');
  const firstRender = useRef(true);

  const callGetProductsApi = async (pageNumber = Number(urlPageIndex)) => {
    setIsFilterLoading(true);
    try {
      if (urlCategoryId) {
        // ارسال page همزمان با category_id
        const result = await getProductShopApi(
          Number(urlCategoryId),
          Number(urlPageIndex),
        );
        setAllProductsData(result);
      } else {
        const result = await getProductsApi(
          pageNumber,
          filter === 'has_discount'
            ? undefined
            : urlDiscount === 'has_discount'
              ? undefined
              : filter,
          String(urlSearch),
          urlTags.length > 0 ? urlTags : undefined,
          filter === 'price'
            ? 'price'
            : filter === '-price'
              ? '-price'
              : undefined,
          filter === 'has_discount'
            ? true
            : urlDiscount === 'has_discount'
              ? true
              : undefined,
          Number(urlBrandId),
        );
        setAllProductsData(result);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsFilterLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetProductsApi();

    if (urlDiscount !== 'has_discount') {
      const url = new URL(window.location.href);
      url.searchParams.delete('has_Discount');
      window.history.replaceState({}, '', url.toString());
    }
  }, [urlSearch, urlDiscount, urlTags, urlPageIndex, urlCategoryId]);

  useEffect(() => {
    callGetProductsApi();

    const url = new URL(window.location.href);
    url.searchParams.delete('has_Discount');
    window.history.replaceState({}, '', url.toString());
  }, [filter]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(urlParams);

    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const params = new URLSearchParams(urlParams);

    if (urlCategoryId) {
      params.delete('category_id');
    }

    if (!debouncedSearch) {
      params.delete('Search');
      params.delete('page');
      handlePageChange(1);
    } else {
      params.set('Search', debouncedSearch.toString());
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [debouncedSearch]);

  useEffect(() => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [allProductsData]);

  const changePageIndex = (pageNumber: string) => {
    handlePageChange(Number(pageNumber));
  };

  return (
    <section className={s.container_shop} ref={productSectionRef}>
      <Breadcrumb brand_name="فروشگاه" brnad_href="/tools-shop" />
      <div className={s.content}>
        <LoadingOverlay visible={isLoading} h="300vh" />
        <Tabs
          variant="pills"
          defaultValue="all"
          w="100%"
          color="red"
          radius="md"
        >
          <div className="flex md:flex-row flex-col justify-between px-2 gap-2">
            <Tabs.List>

              {filters.map((item, index) => (

                <Tabs.Tab
                  key={index + 1}
                  value={item.filter}
                  onClick={() => {
                    const params = new URLSearchParams(urlParams);
                    if (urlCategoryId) {
                      params.delete('category_id');
                    }

                    if (filter === 'ارزان ترین' || 'گران ترین' || 'تخفیف دار') {
                      params.delete('page');
                    }
                    window.history.replaceState(
                      null,
                      '',
                      `${window.location.pathname}?${params.toString()}`,
                    );
                    setfilter(item.filter);
                  }}
                >
                  <span>
                    {item.name}

                  </span>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div>
              <BaseSelectInput
                rightSection={<ChevronDownIcon />}
                withScrollArea={true}
                placeholder="صفحه‌ی 1"
                data={Array.from(
                  { length: Math.ceil((allProductsData?.count ?? 0) / 20) },
                  (_, i) => ({
                    value: String(i + 1),
                    label: `برو به صفحه ${i + 1} `,
                  }),
                )}
                onChange={(k, v) => changePageIndex(k || '1')}
              />
            </div>
            <div className="md:w-[30%] w-full">
              <BaseSearchInput
                placeholder="جستوجو محصولات"
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue || urlSearch}
              />
            </div>
          </div>

          <Divider size="xs" mt="5px" mb="lg" />
          <Tabs.Panel value={filter || 'all'} pt="xs">
            <div className='flex flex-col'>
              {isFilterLoading ? (
                <div className="flex justify-center items-center ">
                  <Loader color="red" size="md" />
                </div>
              ) : (
                <>
                  {allProductsData?.results.length !== 0 ? (
                    <div className={s.cardBox}>
                      {allProductsData?.results.map(
                        (item) =>
                          item.product_product_image.length > 0 && (
                            <CardProduct data={item as any} key={item.id} />
                          ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 bg-slate-50 p-5">
                      محصولی یافت نشد
                    </div>
                  )}
                </>
              )}
            </div>

          </Tabs.Panel>

          <BasePagination
            disabled={isLoading}
            onChange={handlePageChange}
            total={Math.ceil((allProductsData?.count ?? 0) / 20)}
          />
        </Tabs>
      </div>
    </section>
  );
};
export default ToolShop;

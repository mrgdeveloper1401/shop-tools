'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

import { Burger, Loader } from '@mantine/core';

import BagShopButtonDrawer from '@/component/modules/drawer/BagShopButtonDrawer/BagShopButtonDrawer.drawer';
import ShopIcon from '@/component/modules/icons/Shop.icon';
import UserIcon from '@/component/modules/icons/User.icon';
import TomanIcon from '@/component/modules/icons/Toman.icon';
import SearchInputIcon from '@/component/modules/icons/SearchInput.icon';

import getToken from '@/utils/getToken';
import {
  getProductsApi,
  IProducts,
  PaginationWithDataType,
} from '@/data/server_request/dashboard/product';
import { priceFormat } from '@/utils/price-format';

import s from './Navbar.module.css';

const BannerHeaderHome = () => {
  const token = getToken();
  const [bagShop, setBagShop] = useState<any>([]);
  const [opened, { toggle }] = useDisclosure();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const bag = localStorage.getItem('bagShop');
    if (bag) {
      const parse = JSON.parse(bag);
      setBagShop(parse);
    }
  }, []);

  const [allProductsData, setAllProductsData] =
    useState<PaginationWithDataType<IProducts>>();
  const [isLoading, setIsLoading] = useState(false);

  const callGetProductsApi = async () => {
    setIsLoading(true);
    try {
      const result = await getProductsApi(
        1,
        null,
        String(search),
        undefined,
        undefined,
      );
      setAllProductsData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      callGetProductsApi();
    } else {
      setAllProductsData(undefined);
    }
  }, [search]);

  return (
    <div className={s.container}>
      <div className={s.menuIcon}>
        <Burger
          opened={opened}
          onClick={toggle}
          aria-label="Toggle navigation"
        />
      </div>
      <div className={s.right}>
        <Link href="/">
          <Image
            src="/images/home/logo.png"
            alt="لوگو سایت"
            width={200}
            height={200}
          />
        </Link>
        <div className={s.search_container}>
          <div className={s.searchInput}>
            <input
              type="text"
              placeholder="جستوجو برای محصولات"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  callGetProductsApi();
                }
              }}
            />
            <Link href={`/tools-shop?Search=${search}`}>
              {isLoading ? (
                <Loader size="sm" color="red" mt="2px" />
              ) : (
                <SearchInputIcon fontSize={28} width="29px" height="33px" />
              )}
            </Link>
          </div>
          <div className={s.card_list}>
            {allProductsData?.results.map((item) => (
              <Link
                href={`/product/${item.id}/${item.category_id}/${item.product_slug || 'تولز'}`}
                className={s.card}
                key={item.id}
                onClick={() => setAllProductsData(undefined)}
              >
                <div className={s.right}>
                  <Image
                    src={
                      (item.product_product_image.length > 0 &&
                        item.product_product_image[0].image.get_image_url) ||
                      ''
                    }
                    alt={
                      (item.product_product_image.length > 0 &&
                        item.product_product_image[0].alt_text_image) ||
                      ''
                    }
                    width={100}
                    height={100}
                  />
                </div>
                <div className={s.left}>
                  <h3>{item.product_name}</h3>
                  <div>
                    {(() => {
                      const variantSelcted = item.variants.find(
                        (i) => i.product_variant_discounts.length > 0,
                      );
                      if (variantSelcted) {
                        return (
                          <div className={s.price}>
                            <h2
                              className={`s.price ${variantSelcted && variantSelcted?.product_variant_discounts.length > 0 && 'line-through text-[#999] '}`}
                            >
                              {variantSelcted &&
                                priceFormat(variantSelcted?.price)}

                              {variantSelcted &&
                                variantSelcted?.product_variant_discounts
                                  .length > 0 &&
                                variantSelcted?.product_variant_discounts[0]
                                  ?.amount && <span>تومان</span>}
                            </h2>
                            {variantSelcted &&
                              variantSelcted.product_variant_discounts.length >
                              0 ? (
                              <>
                                <div className={s.price_discount}>
                                  <h2>
                                    {(
                                      parseFloat(variantSelcted.price) -
                                      (parseFloat(variantSelcted.price) *
                                        parseFloat(
                                          variantSelcted
                                            .product_variant_discounts[0]
                                            .amount,
                                        )) /
                                      100
                                    ).toLocaleString()}
                                  </h2>
                                  <TomanIcon className="text-[10px] mb-1" />
                                </div>
                              </>
                            ) : (
                              <div className={s.price_discount}>
                                <TomanIcon className="text-[10px] mb-1" />
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <span>
                            {item.variants.length > 0 &&
                              item.variants[0].price ? (
                              <span className="flex items-center gap-1">
                                {priceFormat(item.variants[0].price)}
                                <TomanIcon className="text-[10px] mb-1" />
                              </span>
                            ) : (
                              'تعیین نشده'
                            )}
                          </span>
                        );
                      }
                    })()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className={s.left}>
        <div className={s.login}>
          {token && token?.token && token?.token.access.length > 0 ? (
            <Link href="/p-user">
              <div className={s.userLogined}>
                <UserIcon fontSize={28} />
                <p>ورود به داشبورد</p>
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <div className={s.userLogin}>
                <UserIcon fontSize={28} />
                <p>ورود / ثبت نام</p>
              </div>
            </Link>
          )}
        </div>
        <div className={s.divider}></div>
        <BagShopButtonDrawer>
          <div className={s.shopBox}>
            <span>سبد خرید</span>
            <div className={s.shop}>
              <div className={s.counter}>
                {bagShop.length > 0 ? bagShop.length : 0}
              </div>
              <ShopIcon fontSize={24} />
            </div>
          </div>
        </BagShopButtonDrawer>
      </div>
    </div>
  );
};
export default BannerHeaderHome;

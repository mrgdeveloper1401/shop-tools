'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Loader } from '@mantine/core';

import BagShopButtonDrawer from '@/component/modules/drawer/BagShopButtonDrawer/BagShopButtonDrawer.drawer';
import ShopIcon from '@/component/modules/icons/Shop.icon';
import UserIcon from '@/component/modules/icons/User.icon';
import TomanIcon from '@/component/modules/icons/Toman.icon';
import SearchInputIcon from '@/component/modules/icons/SearchInput.icon';
import HamburMenu from '@/component/modules/HamburMenu/HamburMenu';
import { Handbag } from 'lucide-react';
import {
  getProductsApi,
  IProducts,
  PaginationWithDataType,
} from '@/data/server_request/dashboard/product';
import getToken, { IToken } from '@/utils/getToken';
import { priceFormat } from '@/utils/price-format';

import s from './Navbar.module.css';

const Navbar = ({ data }: { data: any }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [bagShop, setBagShop] = useState<any>([]);
  const [token, setToken] = useState<IToken | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [allProductsData, setAllProductsData] =
    useState<PaginationWithDataType<IProducts>>();

  const updateBagCount = () => {
    const bag = localStorage.getItem('bagShop');
    if (bag) {
      const parse = JSON.parse(bag);
      setBagShop(parse);
    }
  };

  useEffect(() => {
    setSearch('');

    const token = getToken();
    setToken(token);

    updateBagCount();

    window.addEventListener('bagUpdated', updateBagCount);
    return () => window.removeEventListener('bagUpdated', updateBagCount);
  }, []);

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
    if (search.length > 0) {
      callGetProductsApi();
    } else {
      setAllProductsData(undefined);
    }
  }, [search]);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  console.log({
    search,
    isOpen,
    allProductsData
  });
  return (
    <div
      className={`${s.container} w-full ${isVisible ? 'fixed shadow-md' : ''} top-0 right-0 z-40 bg-white transition-all duration-300 ease-in`}
    >
      <div className={s.menuIcon}>
        <HamburMenu data={data} />
      </div>
      <div className={s.right}>
        <Link href="/">
          <Image
            src="/images/home/logo.webp"
            alt="ابزار آلات جی اس تولز | فروشگاه  ابزار آلات صنعتی، دستی و برقی"
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
              onChange={(e) => {
                setSearch(e.target.value);
                if (!isOpen) setIsOpen(true);

              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/tools-shop?Search=${search}`);
                  setIsOpen(false);
                  setSearch('');
                }
              }}
            />
            <Link
              href={`/tools-shop?Search=${search}`}
              onClick={() => {
                setIsOpen(false);
                setSearch('');
              }}
            >
              {isLoading ? (
                <Loader size="sm" color="red" mt="2px" />
              ) : (
                <SearchInputIcon fontSize={28} width="29px" height="33px" />
              )}
            </Link>
          </div>
          <div className={s.card_list}>
            {isOpen &&
              allProductsData?.results.map((item) => (
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
                          (i) => i.product_variant_discounts !== null,
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
                  <div>
                    <button className="bg-red-500 text-white rounded-xl p-2">
                      مشاهده
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className={s.left}>
        <div className={s.login}>
          {token && token?.token && token?.token.access.length > 0 ? (
            <Link
              className={s.userLogined}
              href={`${token.is_staff ? '/p-admin/orders' : '/p-user'}`}
            >
              <UserIcon fontSize={28} />
              <p>ورود به داشبورد</p>
            </Link>
          ) : (
            <Link className={s.userLogin} href="/login">
              <UserIcon fontSize={28} />
              <p>ورود / ثبت نام</p>
            </Link>
          )}
        </div>
        <div className={s.divider}></div>
        <BagShopButtonDrawer>
          <div className={s.shopBox}>
            <span>سبد خرید</span>
            <div className={s.shop}>
              <span className={s.counter}>
                {bagShop.length > 0 ? bagShop.length : 0}
              </span>
              <Handbag />
            </div>
          </div>
        </BagShopButtonDrawer>
      </div>
    </div>
  );
};
export default Navbar;

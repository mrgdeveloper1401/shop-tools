'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Loader } from '@mantine/core';
import Swal from 'sweetalert2';

import BarIcon from '../icons/Bar.icon';
import ChevronDownIcon from '../icons/ChevronDown.icon';
import LogoutIcon from '../icons/Logout.icon';
import TomanIcon from '../icons/Toman.icon';
import UserIcon from '../icons/User.icon';
import SearchInputIcon from '../icons/SearchInput.icon';

import {
  getProductsApi,
  IProducts,
  PaginationWithDataType,
} from '@/data/server_request/dashboard/product';
import getToken, { IToken } from '@/utils/getToken';
import { priceFormat } from '@/utils/price-format';
import { logout } from '@/utils/logout';

import s from './HamburMenu.module.css';

const HamburMenu = ({ data }: any) => {
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [allProductsData, setAllProductsData] =
    useState<PaginationWithDataType<IProducts>>();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [token, setToken] = useState<IToken | undefined>(undefined);

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
    const timer = setTimeout(() => {
      if (search.trim().length > 0) {
        callGetProductsApi();
      } else {
        setAllProductsData(undefined);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);


  const logoutHandler = () => {
    Swal.fire({
      title: 'آیا از خارج مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        router.push('/');
        getTokenHandler();
      }
    });
  };

  const getTokenHandler = () => {
    const token = getToken();
    setToken(token);
  };

  useEffect(() => {
    getTokenHandler();
  }, []);

  return (
    <>
      <button className={s.navbarIcon} onClick={open}>
        <BarIcon />
      </button>

      <Drawer
        opened={opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.1, blur: 2 }}
        position="right"
        size="xs"
        classNames={{
          root: s.root,
          content: s.content,
        }}
        title=""
      >
        <div className={s.search_container}>
          <div className={s.searchInput}>
            <input
              type="text"
              placeholder="جستوجو برای محصولات"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/tools-shop?Search=${search}`);
                }
              }}
            />
            <Link
              href={`/tools-shop?Search=${search}`}
              onClick={() => {
                close();
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
            {allProductsData?.results.map((item) => (
              <Link
                href={`/product/${item.id}/${item.category_id}/${item.product_slug || 'تولز'}`}
                className={s.card}
                key={item.id}
                onClick={() => {
                  close();
                  setAllProductsData(undefined);
                }}
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
                        (i) => i.product_variant_discounts !== null && i.product_variant_discounts.length > 0,
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
        <ul className={s.HamburMenuUlList}>
          {data?.map((item: any, index: number) => (
            <li key={index} className={s.dropDown}>
              <Link href={item.href}>
                <span>{item.name}</span>
                <ChevronDownIcon style={{ rotate: '90deg' }} />
              </Link>
            </li>
          ))}

          <li className={s.dropDown}>
            <div className="flex flex-col w-full gap-4">
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
              {token?.token.access && (
                <button
                  className="flex bg-red-500 text-white px-4 py-2 gap-2 rounded-xl"
                  onClick={logoutHandler}
                >
                  <LogoutIcon />
                  <span>خروج از سایت</span>
                </button>
              )}
            </div>
          </li>
        </ul>
      </Drawer>
    </>
  );
};
export default HamburMenu;

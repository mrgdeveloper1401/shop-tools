'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';

import { Divider, LoadingOverlay, Skeleton, Tabs } from '@mantine/core';

import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import BaseModal from '@/component/modules/modals/BaseModal/Base.modal';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import Adderss from '../../p-user/Adderss/Adderss';
import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import TomanIcon from '@/component/modules/icons/Toman.icon';

import {
  getValidatedCoupunApi,
  submitCreateOrderApi,
} from '@/data/server_request/dashboard/orders';
import { getShippingDetailApi } from '@/data/server_request/dashboard/shipping';
import { getOneAddressApi } from '@/data/server_request/dashboard/profile';
import { priceFormat } from '@/utils/price-format';
import { showSwal } from '@/utils/swalHelper';

import s from './Shopping.module.css';

const Shopping = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [coupunCodeValue, setCoupunCodeValue] = useState<number | null>(null);
  const [coupunCodeName, setCoupunCodeName] = useState<string | null>(null);
  const [addressId, setAddressData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const [ShippingData, setAllShippingData] = useState<any>();
  const [localBag, setLocalBag] = useState<any>([]);
  const [checkCityStatus, setCheckCityStatus] = useState(false);

  const [orderData, setOrderData] = useState<any>({
    items: [],
    address_id: 0,
    shipping: 0,
    coupon_code: undefined,
    description: '',
    phone: '',
    first_name: '',
    last_name: '',
  });

  const submitEditHandler = async () => {
    setIsLoading(true);
    setIsRedirect(true);

    try {
      const neworderData = { ...orderData };
      if (!neworderData.description) {
        delete neworderData.description;
      }

      const res = await submitCreateOrderApi(neworderData);

      if (res.status === 400 && res.response?.data?.shipping) {
        showSwal('لطفا نحوه ی ارسال  را انتخاب کنید!', '', 'warning', 'تایید');
      } else if (res.status === 400 && res.response?.data?.address_id) {
        showSwal('لطفا آدرس خود را انتخاب کنید!', '', 'warning', 'تایید');
      } else if (res.status === 400 && res.response?.data?.first_name) {
        showSwal('لطفا نام گیرنده را وارد کنید!', '', 'warning', 'تایید');
      } else if (res.status === 400 && res.response?.data?.last_name) {
        showSwal(
          'لطفا نام خانوادگی گیرنده را وارد کنید!',
          '',
          'warning',
          'تایید',
        );
      } else if (res.status === 400 && res.response?.data?.phone) {
        showSwal(
          'لطفا شماره تماس گیرنده را وارد کنید!',
          '',
          'warning',
          'تایید',
        );
      }

      if (res.status === 201 || res.status === 200) {
        router.push(
          `https://gateway.zibal.ir/start/${res.data.payment_gateway.trackId}`,
        );
      }
    } catch (error) {
      showSwal('خطایی به وجود آمده است !', '', 'warning', 'تلاش مجدد!');
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsRedirect(false);
    }
  };

  const getLocalStorageBag = () => {
    const bag = localStorage.getItem('bagShop');
    if (bag) {
      const bagData = JSON.parse(bag);

      setLocalBag(bagData);
      setOrderData((prev: any) => ({
        ...prev,
        items: bagData.map((item: any) => ({
          product_variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      }));
    }
  };

  useEffect(() => {
    getLocalStorageBag();
    callGetShippingApi();
  }, []);

  useEffect(() => {
    setOrderData((prev: any) => ({
      ...prev,
      address_id: addressId,
    }));
  }, [addressId]);

  const callGetShippingApi = async () => {
    try {
      const result = await getShippingDetailApi();
      setAllShippingData(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (coupunCodeValue !== null) {
      setOrderData((prev: any) => ({
        ...prev,
        coupon_code: coupunCodeName,
      }));
    } else {
      setOrderData((prev: any) => {
        const data = { ...prev };
        delete data.coupon_code;
        return data;
      });
    }
  }, [coupunCodeValue]);

  const sumAllProduct = localBag.reduce(
    (sum: any, item: any) =>
      sum + parseFloat(item.price) * parseInt(item.quantity),
    0,
  );

  const sumFinalProduct = localBag.reduce(
    (sum: any, item: any) =>
      sum + parseInt(item.final_price) * parseInt(item.quantity),
    0,
  );

  const sumShip =
    orderData.shipping &&
    ShippingData.find((item: any) => item.id === orderData.shipping).price;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 11) value = value.slice(0, 11); // حداکثر ۱۱ رقم
    setOrderData((prev: any) => ({ ...prev, phone: value }));
  };

  useEffect(() => {
    const checkCity = async () => {
      if (orderData.address_id && orderData.shipping) {
        const result = await getOneAddressApi(orderData.address_id);
        if (result.city_name.includes('تبریز')) setCheckCityStatus(true);
      }
    };
    checkCity();

    if (checkCityStatus && orderData.id === 3) {
      showSwal(
        'ارسال رایگان فقط برای شهر تبریز مجاز می باشد!',
        '',
        'warning',
        'تایید',
      );
    }
  }, [orderData.address_id, orderData.shipping]);

  const ActiveInPersonPurchase = localBag.some(
    (item: any) => item.inPersonPurchase,
  );

  return (
    <section className={s.section}>
      <LoadingOverlay visible={isRedirect} h="150vh" />
      <div className={s.right}>
        <Tabs defaultValue="address" mb="md" w="100%">
          <Tabs.List>
            <Tabs.Tab value="cart">
              <Link href="/cart">
                <span className="font-DanaDemiBold text-[16px]">سبد خرید</span>
              </Link>
            </Tabs.Tab>
            <Tabs.Tab value="address">
              <span className="font-DanaDemiBold text-[16px]">
                مرحله نهایی و پرداخت
              </span>
            </Tabs.Tab>
          </Tabs.List>
          <Divider size="xs" />
        </Tabs>
        {/* فیلدهای کاربر */}
        <div className={s.Infos_container}>
          <div className={s.container_userInfo}>
            <div className={s.header}>
              <span>اطلاعات گیرنده</span>
            </div>
            <div className={s.userInfo_inputs}>
              <BaseTextInput
                value={orderData.first_name}
                onChange={(e) =>
                  setOrderData((prev: any) => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
                }
                placeholder="نام"
              />
              <BaseTextInput
                value={orderData.last_name}
                onChange={(e) =>
                  setOrderData((prev: any) => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                }
                placeholder="نام خانوادگی "
              />
              <BaseTextInput
                value={orderData.phone}
                onChange={handlePhoneChange}
                placeholder="شماره تماس گیرنده"
              />
              <BaseTextArea
                value={orderData.description}
                onChange={(e) =>
                  setOrderData((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="توضیحات بیشتر..."
              />
            </div>
          </div>
          <Adderss addressId={addressId} onSetAddressData={setAddressData} />
        </div>
      </div>

      <div className={s.left}>
        <div className={s.container_userInfo}>
          <div className={s.header}>
            <span>نحوه ی ارسال</span>
          </div>
          <div className={s.transport_container}>
            {ShippingData?.map((item: any) => (
              <button
                key={item.id}
                className={`${s.transport_content} ${
                  (item.company.name !== 'تیپاکس پسکرایه'
                    ? ActiveInPersonPurchase
                    : false) && s.transport_content_disable
                }`}
                disabled={
                  item.company.name !== 'تیپاکس پسکرایه'
                    ? ActiveInPersonPurchase
                    : false
                }
              >
                <h3>ارسال با {item.company.name}</h3>
                <div>
                  <span>
                    هزینه:
                    {item.shipping_type === 'free'
                      ? 'تحویل به صورت حضوری از مغازه'
                      : item.shipping_type === 'standard'
                        ? 'پس کرایه'
                        : priceFormat(item.price)}
                  </span>
                  |<span> ارسال {item.estimated_days} روزه </span>
                  <input
                    disabled={
                      item.company.name !== 'تیپاکس پسکرایه'
                        ? ActiveInPersonPurchase
                        : false
                    }
                    type="radio"
                    name="shipping"
                    value={orderData.shipping}
                    onChange={() => {
                      if (checkCityStatus) {
                        setOrderData((prev: any) => ({
                          ...prev,
                          shipping: item.id,
                        }));
                      } else {
                        if (item.id === 3) {
                          showSwal(
                            'ارسال رایگان فقط برای شهر تبریز مجاز می باشد!',
                            '',
                            'warning',
                            'تایید',
                          );
                        } else {
                          setOrderData((prev: any) => ({
                            ...prev,
                            shipping: item.id,
                          }));
                        }
                      }
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={s.cart_price}>
          <div className={s.price_header}>
            <span>قیمت کالاها</span>
            <AddDiscount
              setCoupunCodeValue={setCoupunCodeValue}
              setCoupunCodeName={setCoupunCodeName}
              onClose={close}
              opened={opened}
            >
              <PrimaryButton onClick={open} size="xs">
                افزودن کد تخفیف
              </PrimaryButton>
            </AddDiscount>
          </div>
          <Divider size="xs" color="#f2cfcf" />

          <div className={s.prices}>
            <div className={s.price}>
              <span>مجموع خرید شما:</span>
              <div className={s.price_count}>
                <div className="flex gap-1">
                  <span className="font-DanaFaNumMed">
                    {localBag.length > 0 ? (
                      sumAllProduct.toLocaleString()
                    ) : (
                      <Skeleton w="50px" h="15px" radius="lg" />
                    )}
                  </span>
                  <TomanIcon className="text-[8px] mb-2" />
                </div>
              </div>
            </div>

            <div className={s.price}>
              <span>کد تخفیف:</span>
              <div className={s.price_count}>
                <span>
                  {coupunCodeValue ? (
                    <span>{coupunCodeValue}%</span>
                  ) : (
                    <span>-</span>
                  )}
                </span>
              </div>
            </div>

            <div className={s.price}>
              <span>تخفیف روی کالا:</span>
              <div className={s.price_count}>
                <div className="flex gap-1">
                  <span className="font-DanaFaNumMed">
                    {localBag.length > 0 ? (
                      parseFloat(sumAllProduct) -
                        parseFloat(sumFinalProduct) !==
                      0 ? (
                        (
                          parseFloat(sumAllProduct) -
                          parseFloat(sumFinalProduct)
                        ).toLocaleString()
                      ) : (
                        <>-</>
                      )
                    ) : (
                      <Skeleton w="50px" h="15px" radius="lg" />
                    )}
                  </span>
                  <TomanIcon className="text-[8px] mb-2" />
                </div>
              </div>
            </div>

            <div className={s.price}>
              <span>هزینه بسته بندی</span>
              <div className={s.price_count}>
                <div className="flex gap-1">
                  <span className="font-DanaFaNumMed">20,000</span>
                  <TomanIcon className="text-[8px] mb-2" />
                </div>
              </div>
            </div>

            <div className={s.price}>
              <span>هزینه حمل و نقل</span>
              <div className={s.price_count}>
                <span>
                  {orderData.shipping ? (
                    <div className="flex gap-1">
                      <span className="font-DanaFaNumMed">
                        {priceFormat(
                          ShippingData.find(
                            (item: any) => item.id === orderData.shipping,
                          ).price.toLocaleString(),
                        )}
                      </span>
                      <TomanIcon className="text-[8px] mb-2" />
                    </div>
                  ) : (
                    <div>انتخاب نشده</div>
                  )}
                </span>
              </div>
            </div>

            <div className={s.price}>
              <span>جمع سبد خرید</span>
              <div className={s.price_count}>
                <div className="flex justify-between">
                  {localBag.length > 0 ? (
                    (
                      parseFloat(sumFinalProduct) -
                      parseFloat(sumFinalProduct) *
                        (coupunCodeValue ? coupunCodeValue / 100 : 0) +
                      parseFloat(sumShip)
                    ).toLocaleString()
                  ) : (
                    <Skeleton w="50px" h="15px" radius="lg" />
                  )}

                  <TomanIcon className="text-[8px] mb-2" />
                </div>
              </div>
            </div>

            <PrimaryButton
              onClick={submitEditHandler}
              loading={isLoading}
              fullWidth
            >
              تایید و پرداخت
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shopping;

// ---------------- کد مربوط به دیالوگ تخفیف ----------------
const AddDiscount = ({
  children,
  onClose,
  opened,
  setCoupunCodeValue,
  setCoupunCodeName,
}: {
  children: React.ReactNode;
  onClose: VoidFunction;
  opened: boolean;
  setCoupunCodeValue: (value: number | null) => void;
  setCoupunCodeName: (value: string | null) => void;
}) => {
  const [coupunValue, setCoupunValue] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validCoupunHandler = async () => {
    setIsLoading(true);
    try {
      const result = await getValidatedCoupunApi(coupunValue);
      if (result.status === 404) {
        setIsValid(false);
      } else {
        setIsValid(true);
        setCoupunCodeValue(result.amount);
      }
    } catch {
      // console.log()
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <BaseModal opened={opened} onClose={onClose} size={500} title="ثبت تخفیف">
        <div className={s.discount}>
          <h3>کد تخفیف</h3>
          <BaseTextInput
            placeholder="کد تخفیف خود را وارد کنید"
            onChange={(e) => {
              setCoupunValue(e.target.value);
              setCoupunCodeName(e.target.value);
            }}
            value={coupunValue}
          />
          {isValid !== null &&
            (isValid ? (
              <div className="text-white bg-blue-500 p-2 rounded-lg  mt-2">
                <span>کد تخفیف اعمال گردید.</span>
              </div>
            ) : (
              <div className="text-white bg-red-400 p-2 rounded-lg  mt-2">
                <span>کد تخفیف نامعتبر می باشد!</span>
              </div>
            ))}

          <div className="flex justify-end">
            {!isValid && (
              <PrimaryButton
                mt="sm"
                loading={isLoading}
                onClick={validCoupunHandler}
              >
                اعمال کد تخفیف
              </PrimaryButton>
            )}
            {isValid && (
              <div className="flex gap-1">
                <PrimaryButton onClick={onClose} mt="sm">
                  تایید
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => {
                    setCoupunCodeValue(null);
                    setIsValid(null);
                  }}
                  variant="outline"
                  mt="sm"
                >
                  لغو
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </BaseModal>

      {children}
    </>
  );
};

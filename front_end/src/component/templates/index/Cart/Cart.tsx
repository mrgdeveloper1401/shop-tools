'use client';
import Image from 'next/image';
import Link from 'next/link';
import { notifications, Notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Divider, Loader, Skeleton, Tabs } from '@mantine/core';

import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';

import TomanIcon from '@/component/modules/icons/Toman.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';
import TrashIcon from '@/component/modules/icons/Trash.icon';
import getToken, { IToken } from '@/utils/getToken';
import s from './Cart.module.css';

const Cart = () => {
  const router = useRouter();
  const [token, setToken] = useState<IToken | undefined>(undefined);
  const [localBag, setLocalBag] = useState<any[]>([]);

  const isLoginHandler = () => {
    if (token) {
      router.push('/cart/shopping');
    } else {
      router.push('/login?redirect=true');
    }
  };

  const getLocalStorageBag = () => {
    const bag = localStorage.getItem('bagShop');
    if (bag) {
      setLocalBag(JSON.parse(bag));
    } else {
      setLocalBag([]);
    }
  };

  useEffect(() => {
    try {
      const token = getToken();
      setToken(token);
    } catch (error) {
      // console.log()
    }

    getLocalStorageBag();
  }, []);

  return (
    <section className={s.section}>
      <div className={s.right}>
        <Tabs defaultValue="cart" mb="md" w="100%">
          <Tabs.List>
            <Tabs.Tab value="cart">
              <span className="font-DanaDemiBold text-[16px]">سبد خرید</span>
            </Tabs.Tab>
            <Tabs.Tab value="address" disabled={!token?.token}>
              {token && token?.token ? (
                <Link href="/cart/shopping">
                  <span className="font-DanaDemiBold text-[16px]">
                    مرحله نهایی و پرداخت
                  </span>
                </Link>
              ) : (
                <span className="font-DanaDemiBold text-[16px]">
                  مرحله نهایی و پرداخت
                </span>
              )}
            </Tabs.Tab>
          </Tabs.List>
          <Divider size="xs" />
        </Tabs>
        <CartShop callGetLocalStorageBag={getLocalStorageBag} />
      </div>
      <div className={s.left}>
        <div className={s.cart_price}>
          <h1>قیمت کالاها</h1>
          <Divider size="xs" color="#f2cfcf" />
          <div className={s.prices}>
            <div className={s.price}>
              <span>جمع سبد خرید</span>
              <div className={s.price_count}>
                <span>
                  {localBag.length > 0 ? (
                    localBag
                      .reduce(
                        (sum, item) => sum + item.final_price * item.quantity,
                        0,
                      )
                      .toLocaleString()
                  ) : (
                    <Skeleton w="50px" h="20px" />
                  )}
                </span>
              </div>
            </div>

            <PrimaryButton fullWidth onClick={isLoginHandler}>
              تایید و تکمیل سفارش
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Cart;

const CartShop = ({
  callGetLocalStorageBag,
}: {
  callGetLocalStorageBag: VoidFunction;
}) => {
  const [localBag, setLocalBag] = useState<
    {
      variant_id: number;
      quantity: number;
      product_name: string;
      image_url: string;
      image_alt: string;
      price: number;
      final_price: number;
      discount_percent: number;
    }[]
  >([]);

  const getLocalStorageBag = () => {
    const bag = localStorage.getItem('bagShop');
    if (bag) {
      setLocalBag(JSON.parse(bag));
    } else {
      setLocalBag([]);
    }
  };

  useEffect(() => {
    getLocalStorageBag();
  }, []);

  return (
    <>
      <Notifications />

      <div className={s.bag_container}>
        <div className={s.bag_list}>
          {localBag.map((item) => (
            <CardProductLocal
              key={item.variant_id}
              data={item}
              setLocalBag={setLocalBag}
              localBag={localBag}
              callGetLocalStorageBag={callGetLocalStorageBag}
            />
          ))}
        </div>
        <Divider size="xs" color="#f2cfcf" mt="md" mb="md" />
        <div className={s.total_price_container}>
          <div className={s.total_price}>
            <div className={s.total_price_count}>
              <TomanIcon />
              <span>
                {localBag.length > 0 ? (
                  localBag
                    .reduce(
                      (sum, item) => sum + item.final_price * item.quantity,
                      0,
                    )
                    .toLocaleString()
                ) : (
                  <Skeleton w="50px" h="20px" />
                )}
              </span>
            </div>
            <h4>جمع کل:</h4>
          </div>
        </div>
      </div>
    </>
  );
};

const CardProductLocal = ({
  data,
  setLocalBag,
  localBag,
  callGetLocalStorageBag,
}: {
  data: {
    variant_id: number;
    quantity: number;
    product_name: string;
    image_url: string;
    image_alt: string;
    price: number;
    final_price: number;
    discount_percent: number;
  };
  setLocalBag: any;
  localBag: any;
  callGetLocalStorageBag: VoidFunction;
}) => {
  const removeItem = (variant_id: number) => {
    const existing = localStorage.getItem('bagShop');
    if (existing) {
      const items = JSON.parse(existing);
      const filtered = items.filter(
        (item: any) => item.variant_id !== variant_id,
      );
      localStorage.setItem('bagShop', JSON.stringify(filtered));
      setLocalBag(filtered);
      callGetLocalStorageBag();
    }
  };
  return (
    <>
      <div className={s.bag_card}>
        <div className={s.bag_card_image}>
          <Image
            src={data.image_url}
            width={100}
            height={100}
            alt={data.image_alt}
          />
        </div>
        <div className={s.bag_card_content}>
          <div className={s.bag_card_content_title}>
            <h3>{data.product_name}</h3>
            <button onClick={() => removeItem(data.variant_id)}>
              <TrashIcon />
            </button>
          </div>
          <Counter
            variant_id={data.variant_id}
            quantity={data.quantity}
            setLocalBag={setLocalBag}
            localBag={localBag}
            callGetLocalStorageBag={callGetLocalStorageBag}
          />
          <div className={s.price_product}>
            <span>{data.quantity}</span>
            <span>×</span>
            <div className={s.price}>
              <span>{data.final_price}</span>
              <TomanIcon />
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};

const Counter = ({
  variant_id,
  quantity,
  setLocalBag,
  localBag,
  callGetLocalStorageBag,
}: {
  variant_id: number;
  quantity: number;
  setLocalBag: any;
  localBag: any;
  callGetLocalStorageBag: VoidFunction;
}) => {
  const [countLoading, setCountLoading] = useState(false);

  const updateQuantity = (newQuantity: number) => {
    const existing = localStorage.getItem('bagShop');
    if (existing) {
      const items = JSON.parse(existing);
      const updated = items.map((item: any) =>
        item.variant_id === variant_id
          ? { ...item, quantity: newQuantity }
          : item,
      );
      localStorage.setItem('bagShop', JSON.stringify(updated));
      setLocalBag(updated);
      callGetLocalStorageBag();
    }
  };

  const handleIncrease = () => {
    const checkStock = localBag.find(
      (item: any) => item.variant_id === variant_id,
    );
    if (checkStock.stock > quantity) {
      setCountLoading(true);
      updateQuantity(quantity + 1);
      setTimeout(() => setCountLoading(false), 300);
    } else {
      notifications.show({
        title: '',
        message: 'تعداد محصول بیشتر از موجودی است!',
        radius: 'md',
        color: 'violet',
        icon: <ConfirmIcon strokeWidth={2} />,
      });
    }
  };

  const handleDecrease = () => {
    if (quantity <= 1) return;
    setCountLoading(true);
    updateQuantity(quantity - 1);
    setTimeout(() => setCountLoading(false), 300);
  };

  return (
    <div className={s.counter_conatiner}>
      <Notifications />

      <button className={s.counter_minus} onClick={handleDecrease}>
        -
      </button>
      <button className={s.counter_number}>
        {countLoading ? <Loader color="blue" size="xs" /> : quantity}
      </button>
      <button className={s.counter_plus} onClick={handleIncrease}>
        +
      </button>
    </div>
  );
};

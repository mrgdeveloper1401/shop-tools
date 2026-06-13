'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Divider, Loader } from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';

import TomanIcon from '../../../modules/icons/Toman.icon';
import TrashIcon from '../../../modules/icons/Trash.icon';

import s from './CartShop.module.css';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

const CartShop = () => {
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
            />
          ))}
        </div>
        <Divider size="xs" color="#f2cfcf" mt="md" mb="md" />
        <div className={s.total_price_container}>
          <div className={s.total_price}>
            <div className={s.total_price_count}>
              <TomanIcon />
              <span>
                {localBag.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                )}
              </span>
            </div>
            <span>جمع کل:</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default CartShop;

const CardProductLocal = ({
  data,
  setLocalBag,
  localBag,
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
}: {
  variant_id: number;
  quantity: number;
  setLocalBag: any;
  localBag: any;
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

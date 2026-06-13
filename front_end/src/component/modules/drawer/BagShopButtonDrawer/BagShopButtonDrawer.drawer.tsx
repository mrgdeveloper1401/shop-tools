'use client';
import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Divider, Loader } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';

import BaseDrawer from '../BaseDrawer/BaseDrawer';
import PrimaryButton from '../../PrimaryButton/Primary.button';

import ConfirmIcon from '../../icons/Confirm.icon';
import TomanIcon from '../../icons/Toman.icon';
import TrashIcon from '../../icons/Trash.icon';
import { priceFormat } from '@/utils/price-format';

import s from './BagShopButtonDrawer.module.css';

const BagShopButtonDrawer = ({ children }: { children: React.ReactNode }) => {
  const [opened, { open, close }] = useDisclosure(false);
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
    if (opened) {
      getLocalStorageBag();
    }
  }, [opened]);

  return (
    <>
      <BaseDrawer
        size="md"
        title="سبد خرید"
        opened={opened}
        onClose={close}
        position="right"
      >
        <div className={s.bag_container}>
          <Divider mb="5px" />

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

          <div className={s.total_price_container}>
            <div className={s.total_price}>
              <span>جمع کل:</span>
              <div className={s.total_price_count}>
                <span>
                  {localBag
                    .reduce(
                      (sum, item) => sum + item.final_price * item.quantity,
                      0,
                    )
                    .toLocaleString()}
                </span>
                <TomanIcon />
              </div>
            </div>
            <div className={s.btns}>
              <Link href="/cart" onClick={close}>
                <PrimaryButton w="100%" size="lg">
                  مشاهده سبد خرید
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </BaseDrawer>

      <div onClick={open}>{children}</div>
    </>
  );
};
export default BagShopButtonDrawer;

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
    window.dispatchEvent(new Event('bagUpdated'));
  };

  return (
    <>
      <div className={s.bag_card}>
        <div className={s.bag_card_image}>
          <Image
            src={data.image_url}
            width={100}
            height={100}
            alt={data.product_name}
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
              <span>{priceFormat(String(data.final_price))}</span>
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

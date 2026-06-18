'use client';
import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Notifications, notifications } from '@mantine/notifications';
import { Skeleton } from '@mantine/core';
import BagShopButtonDrawer from '@/component/modules/drawer/BagShopButtonDrawer/BagShopButtonDrawer.drawer';

import TomanIcon from '@/component/modules/icons/Toman.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import { IProductHome } from '@/data/server_request/dashboard/product';
import styles from './CardProduct.module.css';
import { ShoppingCart } from 'lucide-react';

interface CardProductProps {
  data: IProductHome;
}

const CardProduct: FC<CardProductProps> = ({ data }) => {
  const selectedVariant = data.variants?.[0];
  const discount = selectedVariant?.product_variant_discounts?.[0];
  const hasDiscount = discount && Number(discount.amount) > 0;
  const price = selectedVariant ? Number(selectedVariant.price) : 0;
  const finalPrice = hasDiscount
    ? price - (price * Number(discount.amount)) / 100
    : price;

  const callAddProductToLocalStorage = () => {
    // چک موجود بودن variant
    if (!selectedVariant) {
      notifications.show({
        title: '',
        message: 'این محصول در حال حاضر موجود نیست!',
        radius: 'md',
        color: 'red',
        icon: <ConfirmIcon strokeWidth={2} />,
      });
      return;
    }

    // چک موجودی
    if (selectedVariant.stock_number <= 0) {
      notifications.show({
        title: '',
        message: 'این محصول در حال حاضر موجود نیست!',
        radius: 'md',
        color: 'red',
        icon: <ConfirmIcon strokeWidth={2} />,
      });
      return;
    }

    // گرفتن سبد خرید فعلی
    const existing = localStorage.getItem('bagShop');
    const current = existing ? JSON.parse(existing) : [];

    const isExist = current.find(
      (item: any) => item.variant_id === selectedVariant.variant_id,
    );

    const quantity = isExist ? isExist.quantity + 1 : 1;

    // چک تجاوز از موجودی
    if (quantity > selectedVariant.stock_number) {
      notifications.show({
        title: '',
        message: 'برای خرید این محصول لطفا با پشتیبانی تماس بگیرید!',
        radius: 'md',
        color: 'violet',
        icon: <ConfirmIcon strokeWidth={2} />,
      });
      return;
    }

    // آماده‌سازی دیتا برای ذخیره در سبد
    const firstImage = data.product_product_image.find(
      (item) => item.order === 1,
    );
    const imageUrl = firstImage?.image.get_image_url || '';
    const imageAlt = firstImage?.alt_text_image || '';

    const itemData = {
      variant_id: selectedVariant.variant_id,
      quantity,
      product_name: data.product_name,
      image_url: imageUrl,
      image_alt: imageAlt,
      price: price.toString(),
      final_price: finalPrice.toString(),
      discount_percent: discount?.amount || '0',
      stock: selectedVariant.stock_number.toString(),
      inPersonPurchase: data.in_person_purchase,
    };

    // به‌روزرسانی سبد
    const updatedCart = isExist
      ? current.map((item: any) =>
        item.variant_id === selectedVariant.variant_id ? itemData : item,
      )
      : [...current, itemData];

    localStorage.setItem('bagShop', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('bagUpdated'));
  };

  return (
    <div className={styles.box}>
      <Notifications />

      <Link
        href={`/product/${data.id}/${data.category_id}/${data.product_slug || 'تولز'}`}
        aria-label={`خرید ${data.product_name}`}
      >
        <div className={styles.boxTop}>
          {selectedVariant?.product_variant_discounts?.[0]?.amount > 0 && (
            <div className={styles.discount}>
              <span>
                {selectedVariant.product_variant_discounts[0].amount}%
              </span>
            </div>
          )}

          {!data.product_product_image ? (
            <Skeleton width="100%" h="200px" />
          ) : (
            <Image
              src={
                data.product_product_image.length > 0
                  ? data.product_product_image.find((item) => item.order === 1)
                    ?.image?.get_image_url || ''
                  : ''
              }
              alt={data.product_name}
              width={500}
              height={500}
              priority
            />
          )}
        </div>
      </Link>

      <div className={styles.boxBottom}>
        <div className={styles.title}>
          {data.product_name ? (
            <h3>{data.product_name}</h3>
          ) : (
            <Skeleton height={18} width="30%" radius="sm" />
          )}
        </div>

        <div className={styles.productInfo}>
          <div className={styles.price}>
            {selectedVariant ? (
              <div className={styles.priceWrapper}>
                <div className={styles.finalPriceRow}>
                  <span className={styles.finalPrice}>
                    {new Intl.NumberFormat('fa-IR').format(finalPrice)}
                  </span>
                  <TomanIcon className={styles.tomanIcon} />
                </div>

                {hasDiscount && (
                  <div className={styles.oldPrice}>
                    {new Intl.NumberFormat('fa-IR').format(price)}
                  </div>
                )}
              </div>
            ) : (
              <Skeleton height={18} width="30%" radius="xl" />
            )}
          </div>

          <BagShopButtonDrawer>
            <button
              onClick={callAddProductToLocalStorage}
              className={styles.btn}
            >
              <ShoppingCart />
              <span>خرید</span>
            </button>
          </BagShopButtonDrawer>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;

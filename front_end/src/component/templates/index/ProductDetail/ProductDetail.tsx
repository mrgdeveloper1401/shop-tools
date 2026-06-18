'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Divider, Loader, LoadingOverlay, Tabs } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';

import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import Breadcrumb from '@/component/modules/Breadcrumb/Breadcrumb';
import BaseSelectInput from '@/component/modules/inputs/BaseSelectInput/BaseSelect.input';
import BaseModal from '@/component/modules/modals/BaseModal/Base.modal';
import CommentSection from '../Comments/Comments';
import RelatedProducts from '../RelatedProduct/RelatedProduct';

import TomanIcon from '@/component/modules/icons/Toman.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import { Carousel } from '@mantine/carousel';
import { priceFormat } from '@/utils/price-format';
import { IProductDetail } from '@/data/server_request/dashboard/product';

import s from './ProductDetail.module.css';

const ProductDetail = ({
  data,
  categoryId,
}: {
  data: IProductDetail;
  categoryId: number;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [variantSelcted, setVariantSelcted] = useState<{
    price: string;
    variant_id: number;
    product_variant_discounts: { amount: string }[];
    is_available: boolean;
    stock_number: number;
    name: string;
  } | null>(null);

  const variantSelctedHandler = (variant: any) => {
    const variantData = data.variants.find((item) => {
      if (item.variant_id === Number(variant)) {
        setVariantSelcted(item);
      }
    });
  };

  useEffect(() => {
    setVariantSelcted(data.variants[0]);
  }, [data]);

  if (!data.product_name) {
    return <LoadingOverlay visible />;
  }

  const formatPrice = (value: number | string, fractionDigits = 0) => {
    return new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(Number(value));
  };

  return (
    <>
      <Breadcrumb
        brand_name={data.product_brand.brand_name || ''}
        brnad_href={data.product_brand.brand_name || ''}
        product_name={data.product_name}
        product_href={data.product_name}
      />
      <div className={s.product_container}>
        <div className={s.right}>
          <ProductImage
            close={close}
            opened={opened}
            productImages={data.product_product_image}
          />

          <button className={s.product_image} onClick={open}>
            <Image
              src={
                data.product_product_image.find((item) => item.order === 1)
                  ?.image.get_image_url || ''
              }
              className={s.main_image}
              width={700}
              height={700}
              alt={data.product_name}
              priority
            />
          </button>
          <div className={s.right_images}>
            {data.product_product_image.length > 0 &&
              data.product_product_image
                .slice(0, 4)
                .map((item: any, index: number) => (
                  <button onClick={open} key={index}>
                    <Image
                      src={item.image.get_image_url}
                      width={60}
                      height={60}
                      alt={item.alt_text_image}
                    />
                  </button>
                ))}
            {data.product_product_image.length > 4 && (
              <button className={s.imageBtn} onClick={open}>
                ...
              </button>
            )}
          </div>
        </div>
        <div className={s.left}>
          <div className={s.title}>
            <h1>{data.product_name || ''}</h1>
          </div>
          <div className={s.priceTotal}>
            <div className={s.price}>
              <span
                className={`s.price ${variantSelcted && variantSelcted?.product_variant_discounts.length > 0 && 'line-through text-[#999] '}`}
              >
                {variantSelcted &&
                  priceFormat(variantSelcted && variantSelcted?.price)}

                {variantSelcted &&
                  variantSelcted?.product_variant_discounts.length > 0 &&
                  variantSelcted?.product_variant_discounts[0]?.amount && (
                    <span>تومان</span>
                  )}
              </span>
              {variantSelcted &&
                variantSelcted.product_variant_discounts.length > 0 ? (
                <>
                  <div className={s.price_discount}>
                    <span>
                      {variantSelcted &&
                        (
                          parseFloat(variantSelcted.price) -
                          (parseFloat(variantSelcted.price) *
                            parseFloat(
                              variantSelcted.product_variant_discounts[0]
                                .amount,
                            )) /
                          100
                        ).toLocaleString()}
                    </span>
                    <TomanIcon className={s.toman_icon} />
                  </div>
                </>
              ) : (
                <div className={s.price_discount}>
                  <TomanIcon className={s.toman_icon} />
                </div>
              )}
            </div>

            <div className={s.variants}>
              <BaseSelectInput
                w="100%"
                placeholder={
                  variantSelcted
                    ? variantSelcted.name
                    : 'هیچ گزینه ای موجود نیست'
                }
                data={data?.variants.map((item) => ({
                  value: String(item.variant_id),
                  label: `${item.name} - ${priceFormat(item.price)} تومان  ${item.product_variant_discounts.length > 0 ? '|' : ''
                    } ${item.product_variant_discounts.length > 0
                      ? item.product_variant_discounts[0].amount
                      : ''
                    }  ${item.product_variant_discounts.length > 0 ? 'تخفیف' : ''}  `,
                }))}
                onChange={(val) => variantSelctedHandler(val)}
              />
            </div>
          </div>

          <div className={s.specifications}>
            <h2>مشخصات محصول:</h2>
            {data.attributes.length > 0 &&
              data.attributes.map((item: any, index: number) => (
                <div key={index} className={s.specifications_item}>
                  <p>{item.attribute_name}</p>
                  <p>{item.value}</p>
                </div>
              ))}
          </div>

          <div className={s.addToBag}>
            <CounterProduct data={data} variantSelected={variantSelcted} />
            <div className={s.price_fixed}>
              {variantSelcted &&
                variantSelcted?.product_variant_discounts.length > 0
                ? formatPrice(
                  parseFloat(variantSelcted.price) -
                  (parseFloat(variantSelcted.price) *
                    parseFloat(
                      variantSelcted.product_variant_discounts[0].amount,
                    )) /
                  100,
                  0,
                )
                : variantSelcted
                  ? formatPrice(variantSelcted && variantSelcted?.price, 0)
                  : '-'}

              <TomanIcon />
            </div>
          </div>

          <div className={s.product_infos}>
            <div className={s.brands}>
              <h2>برند:</h2>
              <p>{data.product_brand.brand_name || ''}</p>
            </div>
            <div className={s.tags}>
              <h3>برچسب ها:</h3>
              {data.tags.length > 0 &&
                data.tags.map((item: any, index: number) => (
                  <button key={index}>
                    <span>#</span>
                    <h4>{item.tag_name}</h4>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
      <article className={s.bottom}>
        <Tabs defaultValue="description" w="100%">
          <Tabs.List>
            <Tabs.Tab value="description">
              <h2 className="font-DanaDemiBold md:text-[16px] text-[14px] ">
                توضیحات
              </h2>
            </Tabs.Tab>
            <Tabs.Tab
              value="comments"
              className="font-DanaDemiBold md:text-[16px] text-[14px] "
            >
              نظرات کاربران ها
            </Tabs.Tab>
          </Tabs.List>
          <Divider size="xs" />
          <Tabs.Panel value="description" pt="xs">
            <div className="bg-slate-100 p-4 rounded-lg m-2">
              <p className="text-[16px]  text-title">{data.description}</p>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="comments" pt="xs">
            <CommentSection />
          </Tabs.Panel>
        </Tabs>
      </article>
      <RelatedProducts categoryId={categoryId} />
    </>
  );
};

const ProductImage = ({
  opened,
  close,
  productImages,
}: {
  opened: boolean;
  close: VoidFunction;
  productImages: any;
}) => {
  return (
    <BaseModal opened={opened} onClose={close} size={980} title="تصاویر محصول">
      <Carousel
        slideSize="100%"
        emblaOptions={{
          loop: true,
          dragFree: true,
          align: 'center',
        }}
        style={{ direction: 'ltr' }}
        withControls
        withIndicators
      >
        {productImages.length > 0 &&
          productImages.map((item: any) => (
            <Carousel.Slide key={item.id}>
              <div className={s.slide}>
                <Image
                  src={item.image.get_image_url}
                  width={450}
                  height={450}
                  alt={item.alt_text_image}
                />
              </div>
            </Carousel.Slide>
          ))}
      </Carousel>
    </BaseModal>
  );
};
export default ProductDetail;

const CounterProduct = ({
  data,
  variantSelected,
}: {
  data: IProductDetail;
  variantSelected: {
    variant_id: number;
    price: string;
    product_variant_discounts: {
      amount: string;
    }[];
    is_available: boolean;
    stock_number: number;
  } | null;
}) => {
  const [countLoading, setCountLoading] = useState(false);
  const [quantityState, setQuantityState] = useState<number>(0);

  useEffect(() => {
    if (!variantSelected) return;

    const existing = localStorage.getItem('bagShop');
    if (existing) {
      const items = JSON.parse(existing);
      const found = items.find(
        (item: any) => item.variant_id === variantSelected.variant_id,
      );
      if (found) {
        setQuantityState(found.quantity);
      } else {
        setQuantityState(0);
      }
    } else {
      setQuantityState(0);
    }
  }, [variantSelected]);

  const updateQuantity = (newQuantity: number) => {
    if (!variantSelected) return;

    const existing = localStorage.getItem('bagShop');
    let updatedItems: any[] = [];

    const firstImage = data.product_product_image.find(
      (img) => img.order === 1,
    );
    const imageUrl = firstImage?.image.get_image_url || '';
    const imageAlt = firstImage?.alt_text_image || '';
    const inPersonPurchase = data.in_person_purchase;

    const price = parseFloat(variantSelected.price);
    const stock = variantSelected.stock_number;
    const discount = variantSelected.product_variant_discounts?.[0];
    const finalPrice = discount
      ? price - (price * parseFloat(discount.amount)) / 100
      : price;

    const itemData = {
      variant_id: variantSelected.variant_id,
      quantity: newQuantity,
      product_name: data.product_name,
      image_url: imageUrl,
      image_alt: imageAlt,
      price: price.toString(),
      final_price: finalPrice.toString(),
      discount_percent: discount?.amount || '0',
      stock: stock.toString(),
      inPersonPurchase,
    };

    if (existing) {
      const items = JSON.parse(existing);
      const index = items.findIndex(
        (item: any) => item.variant_id === variantSelected.variant_id,
      );

      if (index !== -1) {
        if (newQuantity === 0) {
          updatedItems = items.filter(
            (item: any) => item.variant_id !== variantSelected.variant_id,
          );
        } else {
          items[index] = itemData;
          updatedItems = [...items];
        }
      } else if (newQuantity > 0) {
        updatedItems = [...items, itemData];
      }
    } else if (newQuantity > 0) {
      updatedItems = [itemData];
    }

    localStorage.setItem('bagShop', JSON.stringify(updatedItems));
    setQuantityState(newQuantity);
  };

  const handleIncrease = () => {
    if (!variantSelected || quantityState >= variantSelected.stock_number) {
      notifications.show({
        title: '',
        message: 'تعداد محصول بیشتر از موجودی است!',
        radius: 'md',
        color: 'violet',
        icon: <ConfirmIcon strokeWidth={2} />,
      });
      return;
    }
    setCountLoading(true);
    updateQuantity(quantityState + 1);
    setTimeout(() => setCountLoading(false), 300);
    window.dispatchEvent(new Event('bagUpdated'));
  };

  const handleDecrease = () => {
    if (!variantSelected) return;
    if (quantityState <= 1) {
      updateQuantity(0);
    } else {
      setCountLoading(true);
      updateQuantity(quantityState - 1);
      setTimeout(() => setCountLoading(false), 300);
    }
    window.dispatchEvent(new Event('bagUpdated'));
  };

  const handleAddToCart = () => {
    updateQuantity(1);
    window.dispatchEvent(new Event('bagUpdated'));
  };

  return (
    <>
      <Notifications />
      {quantityState > 0 ? (
        <div className={s.counter_conatiner}>
          <button className={s.counter_minus} onClick={handleDecrease}>
            -
          </button>
          <button className={s.counter_number}>
            {countLoading ? <Loader color="blue" size="xs" /> : quantityState}
          </button>
          <button className={s.counter_plus} onClick={handleIncrease}>
            +
          </button>
        </div>
      ) : (
        <PrimaryButton
          size="lg"
          className={s.add_to_cart_btn}
          onClick={handleAddToCart}
        >
          افزودن به سبد خرید
        </PrimaryButton>
      )}
    </>
  );
};

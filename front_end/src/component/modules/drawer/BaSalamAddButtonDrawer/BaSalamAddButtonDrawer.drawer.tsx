'use client';
import { FC, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useAddBaSalamForm } from '@/hooks/formik/admin-dashboard/useBaSalamFormik';

import Swal from 'sweetalert2';

import BaseDrawer from '../BaseDrawer/BaseDrawer';
import PrimaryButton from '../../PrimaryButton/Primary.button';
import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import BaseSelectSearchInput from '../../inputs/BaseSelectSearchInput/BaseSelectSearch.input';
import ChevronDownIcon from '../../icons/ChevronDown.icon';

import { showSwal } from '../../../../utils/swalHelper';

import {
  submitBaSalamApi,
  submitEditBaSalamApi,
} from '@/data/server_request/dashboard/BaSalam';
import { getOneProductApi } from '@/data/server_request/dashboard/product';
import styles from './BaSalamAddButtonDrawer.module.css';
import { Button } from '@mantine/core';

const dataCategory = [
  {
    value: '667',
    label: 'فرز و پروفیل بر',
  },
  {
    value: '668',
    label: 'قطعات الکترونیکی',
  },
  {
    value: '654',
    label: 'ابزار اندازه گیری دیجیتال',
  },
  {
    value: '655',
    label: 'اتو لوله',
  },
  {
    value: '656',
    label: 'اره برقی و موتوری',
  },
  {
    value: '658',
    label: 'بکس و آچار ضربه ای',
  },
  {
    value: '661',
    label: 'پیچ گوشتی برقی و شارژی',
  },
  {
    value: '662',
    label: 'دریل و مته',
  },
  {
    value: '663',
    label: 'دستگاه جوش',
  },
  {
    value: '664',
    label: 'دستگاه چسب',
  },
  {
    value: '666',
    label: 'سشوار صنعتی',
  },
  {
    value: '670',
    label: 'هویه و لحیم',
  },
  {
    value: '674',
    label: 'اره',
  },
  {
    value: '691',
    label: 'میخ',
  },
  {
    value: '671',
    label: 'آچار',
  },
  {
    value: '672',
    label: 'ابزار اندازه گیری دستی',
  },
  {
    value: '675',
    label: 'انبر',
  },
  {
    value: '676',
    label: 'بست و واشر',
  },
  {
    value: '677',
    label: 'پیچ گوشتی و فازمتر',
  },
  {
    value: '678',
    label: 'پیچ و مهره',
  },
  {
    value: '679',
    label: 'تجهیزات باربری',
  },
  {
    value: '680',
    label: 'تجهیزات کارگاهی',
  },
  {
    value: '681',
    label: 'جعبه و کیف ابزار',
  },
  {
    value: '682',
    label: 'چسب صنعتی و حلال چسب',
  },
  {
    value: '683',
    label: 'چکش و تیشه',
  },
  {
    value: '684',
    label: 'ست ابزار',
  },
  {
    value: '685',
    label: 'سوهان، سنباده و سنبه',
  },
  {
    value: '686',
    label: 'شعله افکن',
  },
  {
    value: '687',
    label: 'کاتر',
  },
  {
    value: '688',
    label: 'گیره و پیچ دستی',
  },
  {
    value: '689',
    label: 'لوازم روانکاری',
  },
  {
    value: '690',
    label: 'منگنه کوب و میخ کوب',
  },
  {
    value: '692',
    label: 'نردبان',
  },
  {
    value: '695',
    label: 'تلمبه',
  },
  {
    value: '696',
    label: 'رادیاتور',
  },
  {
    value: '697',
    label: 'شلنگ',
  },
  {
    value: '698',
    label: 'شیرآلات',
  },
  {
    value: '699',
    label: 'لوله و اتصالات',
  },
  {
    value: '693',
    label: 'ابزار جوشکاری',
  },
  {
    value: '694',
    label: 'پمپ آب و کولر',
  },
  {
    value: '700',
    label: 'دستکش کار',
  },
  {
    value: '701',
    label: 'عینک و کلاه ایمنی',
  },
  {
    value: '702',
    label: 'کپسول آتش نشانی',
  },
  {
    value: '703',
    label: 'کفش ایمنی',
  },
  {
    value: '704',
    label: 'لباس کار',
  },
  {
    value: '705',
    label: 'درب ورودی',
  },
  {
    value: '707',
    label: 'دستگیره درب و کمد',
  },
  {
    value: '709',
    label: 'قفل',
  },
  {
    value: '710',
    label: 'گاوصندوق',
  },
  {
    value: '711',
    label: 'تبر، بیل و کلنگ',
  },
  {
    value: '713',
    label: 'سمپاش',
  },
  {
    value: '714',
    label: 'علف زن و چمن زن',
  },
  {
    value: '715',
    label: 'فرغون',
  },
  {
    value: '717',
    label: 'لوازم آبیاری',
  },
  {
    value: '718',
    label: 'لوازم تزئینی باغبانی',
  },
  {
    value: '719',
    label: 'لوازم زنبورداری',
  },
  {
    value: '720',
    label: 'موتور برق',
  },
  {
    value: '716',
    label: 'قیچی‌، چاقو و ابزار باغبانی',
  },
  {
    value: '749',
    label: 'رنگ و اسپری ساختمان',
  },
  {
    value: '750',
    label: 'کابینت',
  },
  {
    value: '751',
    label: 'کفشور',
  },
  {
    value: '752',
    label: 'لولا و آرام بند',
  },
  {
    value: '753',
    label: 'مصالح ساختمانی',
  },
  {
    value: '673',
    label: 'ابزار نقاشی ساختمان',
  },
  {
    value: '660',
    label: 'پوشش کف و سقف',
  },
  {
    value: '659',
    label: 'پوستر و کاغذ دیواری',
  },
];

interface BaSalamAddButtonDrawerProps {
  productId: number;
  categoryId: number;
}
const BaSalamAddButtonDrawer: FC<BaSalamAddButtonDrawerProps> = ({
  productId,
  categoryId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const submitEditHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا ازافزودن به باسلام اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await submitBaSalamApi(productId, values);
          if (res.status === 201 || res.status === 200) {
            Swal.fire({
              title: 'با موفقیت انجام شد.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        } finally {
        }
      }
    });
  };

  const { handleSubmit, setFieldValue, values, errors, handleChange } =
    useAddBaSalamForm(submitEditHandler);

  const callGetProductApi = async () => {
    try {
      const result = await getOneProductApi(productId, categoryId);

      const discountedVariants = result.variants.map((variant) => {
        const originalPrice = parseFloat(variant.price);
        const discount = variant.product_variant_discounts[0];

        const finalPrice =
          discount && discount.discount_type === 'percent'
            ? originalPrice * (1 - parseFloat(discount.amount) / 100)
            : originalPrice;

        return {
          ...variant,
          finalPrice,
        };
      });

      const cheapestVariant = discountedVariants.reduce((min, curr) => {
        return curr.finalPrice < min.finalPrice ? curr : min;
      });

      setFieldValue('primary_price', cheapestVariant.finalPrice * 10);
      setFieldValue('stock', cheapestVariant.stock_number);
      setFieldValue('name', result.product_name);
      setFieldValue('description', result.description);
      setFieldValue('sku', result.sku);
      setFieldValue('status', 3568);
      setFieldValue(
        'photo',
        result.product_product_image[0].image.image_id_ba_salam,
      );
    } catch (error) {
      // console.log(error)
    }
  };

  useEffect(() => {
    if (opened) callGetProductApi();
  }, [opened]);

  useEffect(() => {
    setFieldValue('status', categoryId);
  }, []);

  const removeFromBaSalamhandler = async () => {
    Swal.fire({
      title: 'آیا از لغو اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await submitEditBaSalamApi(productId, { status: 3790 });
          if (res.status === 201 || res.status === 200) {
            Swal.fire({
              title: 'با موفقیت لغو گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        } finally {
        }
      }
    });
  };

  const updateFromBaSalamhandler = async () => {
    Swal.fire({
      title: 'آیا از آپدیت اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const {
            is_wholesale,
            package_weight,
            preparation_days,
            weight,
            status,
            ...newValues
          } = values;
          let submitValues: any = { ...newValues };
          if (submitValues.category_id === 0) {
            const { category_id, ...rest } = submitValues;
            submitValues = rest;
          }

          const res = await submitEditBaSalamApi(productId, {
            ...submitValues,
            status: 3568,
          });
          if (res.status === 201 || res.status === 200) {
            Swal.fire({
              title: 'با موفقیت اعمال گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        } finally {
        }
      }
    });
  };

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="80%"
        title="افزودن  به باسلام"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseSelectSearchInput
                name="category"
                rightSection={<ChevronDownIcon />}
                withScrollArea={true}
                placeholder="دسته بندی را انتخاب کنید"
                data={dataCategory}
                onChange={(value: any) =>
                  setFieldValue('category_id', Number(value))
                }
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="primary_price"
                value={values.primary_price.toLocaleString()}
                error={errors.primary_price}
                label="قیمت محصول"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <PrimaryButton type="submit">افزودن</PrimaryButton>

            <PrimaryButton variant="outline" onClick={updateFromBaSalamhandler}>
              آپدیت و افزودن دوباره
            </PrimaryButton>
            <PrimaryButton variant="outline" onClick={removeFromBaSalamhandler}>
              لغو
            </PrimaryButton>

            <span className="text-red-800 text-center">
              {errors.category_id}
            </span>
            <span className="text-red-800 text-center">
              {errors.description}
            </span>
            <span className="text-red-800 text-center">{errors.name}</span>
            <span className="text-red-800 text-center">{errors.photo}</span>
            <span className="text-red-800 text-center">
              {errors.primary_price}
            </span>
            <span className="text-red-800 text-center">{errors.sku}</span>
            <span className="text-red-800 text-center">{errors.status}</span>
            <span className="text-red-800 text-center">{errors.stock}</span>
          </div>
        </form>
      </BaseDrawer>
      <Button
        variant="filled" color="red" radius="xl"
        onClick={open}

      >
        افزودن به باسلام

      </Button>

    </>
  );
};
export default BaSalamAddButtonDrawer;

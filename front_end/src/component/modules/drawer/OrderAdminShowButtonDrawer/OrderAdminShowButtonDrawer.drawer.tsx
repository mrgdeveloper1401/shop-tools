'use client';
import { FC, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useOrderInfoForm } from '@/hooks/formik/admin-dashboard/useOrderInfoFormik';

import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../PrimaryButton/Primary.button';
import {
  getCityApi,
  getOneAddressApi,
  getStateApi,
  ICity,
  IState,
} from '@/data/server_request/dashboard/profile';
import { getOneShippingDetailApi } from '@/data/server_request/dashboard/shipping';
import { priceFormat } from '@/utils/price-format';

import styles from './OrderAdminShowButtonDrawer.module.css';

interface IOrderAdminShowButtonDrawerProps {
  AddressId: number;
  ShippingId: number;
}
const OrderAdminShowButtonDrawer: FC<IOrderAdminShowButtonDrawerProps> = ({
  AddressId,
  ShippingId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [stateData, setStateData] = useState<IState[]>([]);
  const [cityData, setCityData] = useState<ICity[]>([]);

  const submitHandler = async (values: any) => {};

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useOrderInfoForm(submitHandler);

  const callGetOneOrderAdminApi = async () => {
    try {
      const result = await getOneAddressApi(AddressId);
      setFieldValue('address_line', result.address_line);
      setFieldValue('city', result.city);
      setFieldValue('state', result.state);
      setFieldValue('postal_code', result.postal_code);
    } catch (error) {
      // console.log(error);
    }
  };

  const callStateApi = async () => {
    const resultState = await getStateApi();
    setStateData(resultState);
  };

  const callCityApi = async (stateId: number) => {
    const resultCity = await getCityApi(stateId);
    setCityData(resultCity);
  };

  useEffect(() => {
    if (values.state) callCityApi(values.state);
  }, [values.state]);

  const callGetShippingDetailApi = async () => {
    try {
      const result = await getOneShippingDetailApi(ShippingId);
      setFieldValue('name', result.company.name);
      setFieldValue('price', result.price);
    } catch (error) {
      // console.log(error)
    }
  };

  useEffect(() => {
    if (opened) {
      callStateApi();
      callGetOneOrderAdminApi();
      callGetShippingDetailApi();
    }
  }, [opened]);
  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="مشاهده جزئیات و آدرس"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div>
              <BaseTextInput
                labelProps={{
                  'data-floating': true,
                }}
                label="استان"
                name="state"
                autoComplete="off"
                value={
                  stateData.find((item) => item.id === values.state)?.name
                }
              />
            </div>
            <div>
              <BaseTextInput
                label="شهر"
                labelProps={{
                  'data-floating': true,
                }}
                name="state"
                autoComplete="off"
                value={cityData.find((item) => item.id === values.city)?.name}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                labelProps={{
                  'data-floating': true,
                }}
                value={values.address_line}
                error={errors.address_line}
                label="آدرس"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                labelProps={{
                  'data-floating': true,
                }}
                value={values.postal_code}
                error={errors.postal_code}
                label="کد پستی"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                labelProps={{
                  'data-floating': true,
                }}
                value={values.name}
                error={errors.name}
                label="شرکت حمل و نقل"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                labelProps={{
                  'data-floating': true,
                }}
                value={priceFormat(values.price)}
                error={errors.price}
                label="پرداخت حمل و نقل"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <PrimaryButton onClick={close} size="lg" variant="primary">
              تایید
            </PrimaryButton>
          </div>
        </form>
      </BaseDrawer>
      <PrimaryButton onClick={open}>مشاهده آدرس</PrimaryButton>
    </>
  );
};
export default OrderAdminShowButtonDrawer;

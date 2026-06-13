'use client';
import { FC, useEffect, useState } from 'react';
import { useAddAddressForm } from '@/hooks/formik/admin-dashboard/useAddAddressFormik';
import { useDisclosure } from '@mantine/hooks';

import Swal from 'sweetalert2';
import { Divider, LoadingOverlay } from '@mantine/core';

import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import BaseSelectSearchInput from '@/component/modules/inputs/BaseSelectSearchInput/BaseSelectSearch.input';
import BaseModal from '@/component/modules/modals/BaseModal/Base.modal';

import PlusIcon from '@/component/modules/icons/Plus.icon';
import LocationIcon from '@/component/modules/icons/Location.icon';
import TrashIcon from '@/component/modules/icons/Trash.icon';
import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';

import {
  deleteAddressApi,
  getAddressApi,
  getCityApi,
  getStateApi,
  IAddress,
  ICity,
  IState,
  submitAddressApi,
} from '@/data/server_request/dashboard/profile';
import { showSwal } from '@/utils/swalHelper';

import s from './Adderss.module.css';

interface AddressProps {
  addressId?: number | null;
  onSetAddressData?: (id: number) => void;
}

const Adderss: FC<AddressProps> = ({ addressId, onSetAddressData }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addressData, setAddressData] = useState<IAddress[]>();
  const callGetAllAddress = async () => {
    try {
      setIsLoading(true);
      const result = await getAddressApi();
      setAddressData(result);
    } catch (error) {
      // console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetAllAddress();
  }, []);

  const deleteAddressHandler = async (id: number) => {
    Swal.fire({
      title: 'آیا از حذف مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteAddressApi(id);
          if (res.status === 204) {
            showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetAllAddress();
          } else {
            showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
          }
        } catch (error) {
          showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  return (
    <div className={s.main}>
      <AddNewAddress
        onClose={close}
        opened={opened}
        callGetAllAddress={callGetAllAddress}
      />
      <div className={s.container_address}>
        <div className={s.header}>
          <h1>آدرس ها</h1>
          <PrimaryButton
            leftSection={<PlusIcon fontSize={20} width="2em" />}
            size="xs"
            styles={{ root: { borderRadius: '50px' } }}
            onClick={open}
          >
            افزودن آدرس جدید
          </PrimaryButton>
        </div>

        {isLoading ? (
          <LoadingOverlay visible={isLoading} />
        ) : (
          <>
            {addressData && addressData.length > 0 ? (
              <>
                {addressData?.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onSetAddressData) {
                        onSetAddressData(item.id);
                      }
                    }}
                    className={`${s.box} ${addressId && addressId === item.id ? s.active : ''}`}
                  >
                    <div className={s.header_box}>
                      <div className={s.header_box_address}>
                        <LocationIcon />
                        <h3 className={s.title}>{item.address_line}</h3>
                      </div>
                      <div>
                        <div
                          onClick={() => deleteAddressHandler(item.id)}
                          className={s.trash_btn}
                        >
                          <TrashIcon />
                        </div>
                      </div>
                    </div>
                    <div className={s.body_box}>
                      <span>کد پستی: {item.postal_code}</span>
                      <span>گیرنده: {item.title} </span>
                    </div>
                    <PrimaryButton>تایید آدرس</PrimaryButton>
                  </button>
                ))}
              </>
            ) : (
              <div>آدرسی ثبت نشده است!</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Adderss;

const AddNewAddress = ({
  onClose,
  opened,
  callGetAllAddress,
}: {
  onClose: VoidFunction;
  opened: boolean;
  callGetAllAddress: VoidFunction;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stateData, setStateData] = useState<IState[]>([]);
  const [cityData, setCityData] = useState<ICity[]>([]);

  const submitHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از اضافه کردن  مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const result = await submitAddressApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetAllAddress();
            onClose();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        } finally {
          setIsLoading(false);
        }
      }
    });

    try {
    } catch (error) {
      // console.log(error);
    }
  };
  const { values, handleChange, handleSubmit, errors, setFieldValue } =
    useAddAddressForm(submitHandler);

  const callStateApi = async () => {
    const result = await getStateApi();
    setStateData(result);
  };
  const callCityApi = async (stateId: number) => {
    const result = await getCityApi(stateId);
    setCityData(result);
  };

  useEffect(() => {
    if (opened) callStateApi();
  }, [opened]);

  useEffect(() => {
    if (values.state) callCityApi(values.state);
  }, [values.state]);

  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      size={768}
      title="ثبت آدرس جدید"
    >
      <form onSubmit={handleSubmit} className={s.box_address}>
        <div className={s.select}>
          <div>
            <BaseSelectSearchInput
              name="state"
              rightSection={<ChevronDownIcon />}
              withScrollArea={true}
              autoComplete="off"
              placeholder=" *استان خود را انتخاب کنید"
              data={
                stateData?.map((item: any, index: number) => ({
                  value: String(item.id),
                  label: `${index + 1} - ${item.name}`,
                })) || []
              }
              onChange={(value: any) => setFieldValue('state', Number(value))}
            />
          </div>
          <div>
            <BaseSelectSearchInput
              name="city"
              autoComplete="off"
              rightSection={<ChevronDownIcon />}
              withScrollArea={true}
              placeholder=" *شهر خود را انتخاب کنید"
              data={
                cityData?.map((item: any, index: number) => ({
                  value: String(item.id),
                  label: `${index + 1} - ${item.name}`,
                })) || []
              }
              onChange={(value: any) => setFieldValue('city', Number(value))}
            />
          </div>
        </div>
        <div>
          <BaseTextInput
            label="*آدرس "
            name="address_line"
            onChange={handleChange}
            value={values.address_line}
            error={errors.address_line}
          />
        </div>

        <div className={s.select}>
          <BaseTextInput
            label="*کد‌پستی"
            name="postal_code"
            onChange={handleChange}
            value={values.postal_code}
            error={errors.postal_code}
          />

          <BaseTextInput
            label="*نام گیرنده"
            name="title"
            onChange={handleChange}
            value={values.title}
            error={errors.title}
          />
        </div>
        <Divider />
        <PrimaryButton loading={isLoading} type="submit" size="lg">
          تایید
        </PrimaryButton>
      </form>
    </BaseModal>
  );
};

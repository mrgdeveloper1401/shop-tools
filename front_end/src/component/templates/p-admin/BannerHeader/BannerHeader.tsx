'use client';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useCreateBannerHeaderForm } from '@/hooks/formik/admin-dashboard/useCreateBannerHeaderFormik';

import { ColorInput } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';

import Swal from 'sweetalert2';

const BaseTable = lazy(
  () => import('../../../modules/tables/BaseTable/Base.table'),
);

import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import BaseImageUpload from '@/component/modules/inputs/BaseImageUpload/BaseImageUpload.input';

import { showSwal } from '../../../../utils/swalHelper';
import { BannerHeaderColumnsData } from './BannerHeader.table';

import TrashIcon from '@/component/modules/icons/Trash.icon';
import {
  getBannerHeaderAdminApi,
  IBanner,
  submitBannerHeaderApi,
} from '@/data/server_request/dashboard/banner';
import { submitImageFileApi } from '@/data/server_request/dashboard/product';

import styles from './BannerHeader.module.css';

const BannerHeader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allBannerHeaderData, setAllBannerHeaderData] = useState<IBanner[]>();
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

  const submitHandler = async (values: any) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== '' && value !== null,
      ),
    );
    Swal.fire({
      title: 'آیا از اضافه کردن  مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await submitBannerHeaderApi(filteredValues);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetBannerHeaderApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useCreateBannerHeaderForm(submitHandler);

  const callGetBannerHeaderApi = async () => {
    try {
      const result = await getBannerHeaderAdminApi();
      setAllBannerHeaderData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetBannerHeaderApi();
  }, []);

  useEffect(() => {
    if (fileImage.length > 0) {
      callSubmitImageFileApi();
    }
  }, [fileImage]);

  const callSubmitImageFileApi = async () => {
    setIsUploadImageLoading(true);
    setErrorUploadImageLoading(false);
    try {
      const formData = new FormData();
      formData.append('image', fileImage[0]);
      const result = await submitImageFileApi(formData);
      setFieldValue('images', [result.id]);
    } catch (error) {
      // setErrorUploadImageLoading(true);
    } finally {
      setIsUploadImageLoading(false);
    }
  };

  const clearImageHandler = () => {
    setFileImage([]);
    setFieldValue('images', null);
  };
  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد بنر </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <div className={styles.background_color}>
              <ColorInput
                size="md"
                radius="md"
                placeholder="انتخاب رنگ پس زمینه"
                value={values.background_color}
                onChange={(value) => setFieldValue('background_color', value)}
              />
            </div>
          </div>

          <div className={styles.input}>
            <div className={styles.background_color}>
              <ColorInput
                size="md"
                radius="md"
                placeholder="انتخاب رنگ  متن"
                value={values.text_color}
                onChange={(value) => setFieldValue('text_color', value)}
              />
            </div>
          </div>
          <div className={styles.input}>
            <BaseTextInput
              value={values.header_title}
              name="header_title"
              label="متن"
              rightSection={null}
              error={errors.header_title}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseImageUpload
              isUploadImageLoading={isUploadImageLoading}
              files={fileImage}
              onSetFiles={setFileImage}
            />
            <div>
              {errorUploadImageLoading && (
                <p className="text-center text-red-600">خطا در بارگذاری عکس</p>
              )}
            </div>
            {fileImage.length > 0 && (
              <PrimaryButton mt="md" onClick={clearImageHandler}>
                حذف عکس
                <TrashIcon />
              </PrimaryButton>
            )}
          </div>

          <div className={styles.input}>
            <PrimaryButton fullWidth size="lg" type="submit" variant="primary">
              ایجاد بنر جدید
            </PrimaryButton>
          </div>
        </div>
      </form>
      <Suspense>
        <BaseTable
          loadingCount={3}
          isLoading={isLoading}
          columns={BannerHeaderColumnsData(callGetBannerHeaderApi)}
          data={allBannerHeaderData as IBanner[]}
        />
      </Suspense>
    </div>
  );
};
export default BannerHeader;

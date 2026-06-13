'use client';
import { lazy, Suspense, useEffect, useState } from 'react';

import { useCreateBannerLandingForm } from '@/hooks/formik/admin-dashboard/useCreateBannerLandingFormik';
import { FileWithPath } from '@mantine/dropzone';

import Swal from 'sweetalert2';

const BaseTable = lazy(
  () => import('../../../modules/tables/BaseTable/Base.table'),
);

import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import BaseImageUpload from '@/component/modules/inputs/BaseImageUpload/BaseImageUpload.input';

import { showSwal } from '../../../../utils/swalHelper';
import { BannerLandingColumnsData } from './BannerLanding.table';

import TrashIcon from '@/component/modules/icons/Trash.icon';
import {
  getBannerLandingAdminApi,
  IBannerCarousel,
  submitBannerLandingApi,
} from '@/data/server_request/dashboard/banner';
import { submitImageFileApi } from '@/data/server_request/dashboard/product';

import styles from './BannerLanding.module.css';

const BannerLanding = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allBannerLandingData, setAllBannerLandingData] =
    useState<IBannerCarousel[]>();
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

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
        try {
          const result = await submitBannerLandingApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetBannerLandingApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useCreateBannerLandingForm(submitHandler);

  const callGetBannerLandingApi = async () => {
    try {
      const result = await getBannerLandingAdminApi();
      setAllBannerLandingData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetBannerLandingApi();
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
      setFieldValue('image', result.id);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsUploadImageLoading(false);
    }
  };

  const clearImageHandler = () => {
    setFileImage([]);
    setFieldValue('image', null);
  };
  return (
    <>
      <div className={styles.RegisterMain}>
        <div className={styles.nameSection}>
          <span>ایجاد بنر صفحه اصلی</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                value={values.name}
                name="name"
                label="متن عکس"
                rightSection={null}
                error={errors.name}
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
                  <p className="text-center text-red-600">
                    خطا در بارگذاری عکس
                  </p>
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
              <PrimaryButton
                fullWidth
                size="lg"
                type="submit"
                variant="primary"
              >
                ایجاد بنر جدید
              </PrimaryButton>
            </div>
          </div>
        </form>
        <Suspense>
          <BaseTable
            loadingCount={3}
            isLoading={isLoading}
            columns={BannerLandingColumnsData(callGetBannerLandingApi)}
            data={allBannerLandingData as IBannerCarousel[]}
          />
        </Suspense>
      </div>
    </>
  );
};
export default BannerLanding;

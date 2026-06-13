'use client';
import { FC, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useEditBrandForm } from '@/hooks/formik/admin-dashboard/useEditBrandFormik';

import Swal from 'sweetalert2';

import { FileWithPath } from '@mantine/dropzone';
import BaseImageUpload from '@/component/modules/inputs/BaseImageUpload/BaseImageUpload.input';
import BaseTextInput from '../../../inputs/BaseTextInput/BaseText.input';
import BaseDrawer from '../../BaseDrawer/BaseDrawer';
import PrimaryButton from '../../../PrimaryButton/Primary.button';
import EditIcon from '@/component/modules/icons/Edit.icon';

import { showSwal } from '@/utils/swalHelper';
import {
  submitEditBrandsApi,
  submitImageFileApi,
} from '@/data/server_request/dashboard/product';

import styles from './BrandEditButtonDrawer.module.css';

interface IBrandEditButtonDrawerProps {
  BrandId: number;
  callGetBrandsApi: VoidFunction;
}
const BrandEditButtonDrawer: FC<IBrandEditButtonDrawerProps> = ({
  BrandId,
  callGetBrandsApi,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

  const submitHandler = async (values: any) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== '' && value !== null,
      ),
    );
    Swal.fire({
      title: 'آیا از ادیت خود اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await submitEditBrandsApi(BrandId, filteredValues);
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: 'برند با موفقیت ادیت گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
            callGetBrandsApi();
            close();
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useEditBrandForm(submitHandler);

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
      setFieldValue('brand_image', result.id);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsUploadImageLoading(false);
    }
  };

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="ادیت برند"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                labelProps={{
                  'data-floating': true,
                }}
                name="brand_name"
                value={values.brand_name || ''}
                error={errors.brand_name}
                label="برند"
                leftSection={null}
                rightSection={null}
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
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <PrimaryButton
              size="lg"
              variant="outline"
              type="button"
              onClick={close}
            >
              لغو
            </PrimaryButton>
            <PrimaryButton size="lg" variant="primary" type="submit">
              تایید
            </PrimaryButton>
          </div>
        </form>
      </BaseDrawer>
      <button onClick={open}>
        <EditIcon />
      </button>
    </>
  );
};
export default BrandEditButtonDrawer;

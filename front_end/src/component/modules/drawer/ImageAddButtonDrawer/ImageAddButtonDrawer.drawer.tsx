'use client';
import { FC, Suspense, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useAddImageForm } from '@/hooks/formik/admin-dashboard/useAddImageFormik';

import { FileWithPath } from '@mantine/dropzone';
import Swal from 'sweetalert2';

import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTable from '../../tables/BaseTable/Base.table';
import PrimaryButton from '../../PrimaryButton/Primary.button';
import BaseImageUpload from '../../inputs/BaseImageUpload/BaseImageUpload.input';

import {
  getImagesApi,
  IImages,
  submitImageApi,
  submitImageFileApi,
} from '@/data/server_request/dashboard/product';
import { ImagesColumnsData } from './ImageAddButtonDrawer.table';
import { showSwal } from '../../../../utils/swalHelper';

import styles from './ImageAddButtonDrawer.module.css';

interface ImageAddButtonDrawerProps {
  productId: number;
  categoryId: number;
}
const ImageAddButtonDrawer: FC<ImageAddButtonDrawerProps> = ({
  productId,
  categoryId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);
  const [allImagesData, setAllImagesData] = useState<IImages[]>();

  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

  const submitEditHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از افزودن عکس اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsUploadLoading(true);
        try {
          const res = await submitImageApi(categoryId, productId, values);
          if (res.status === 201 || res.status === 200) {
            Swal.fire({
              title: 'با موفقیت انجام شد.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
            callGetImagesApi();
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        } finally {
          setIsUploadLoading(false);
        }
      }
    });
  };

  const { values, handleSubmit, handleChange, errors, setFieldValue } =
    useAddImageForm(submitEditHandler);

  const callGetImagesApi = async () => {
    try {
      const result = await getImagesApi(categoryId, productId);
      setAllImagesData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) callGetImagesApi();
  }, [opened]);

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

  useEffect(() => {
    setFieldValue('product', productId);
    if (fileImage.length > 0) {
      callSubmitImageFileApi();
    }
  }, [fileImage]);
  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="80%"
        title="افزودن عکس"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                name="alt_text_image"
                label="عنوان عکس"
                value={values.alt_text_image}
                error={errors.alt_text_image}
                onChange={handleChange}
                rightSection={null}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="order"
                label="ترتیب نمایش"
                value={values.order || ''}
                error={errors.order}
                onChange={handleChange}
                rightSection={null}
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
            <div className={styles.input}>
              <PrimaryButton
                type="submit"
                fullWidth
                size="lg"
                variant="primary"
                loading={isUploadLoading}
              >
                بارگذاری عکس
              </PrimaryButton>
            </div>
          </div>
        </form>
        <Suspense>
          <div className={styles.table}>
            <BaseTable
              loadingCount={5}
              isLoading={isLoading}
              columns={ImagesColumnsData(
                categoryId,
                productId,
                callGetImagesApi,
              )}
              data={allImagesData as any}
            />
          </div>
        </Suspense>
      </BaseDrawer>
      <PrimaryButton onClick={open} size="xs" className={styles.td}>
        افزودن عکس
      </PrimaryButton>
    </>
  );
};
export default ImageAddButtonDrawer;

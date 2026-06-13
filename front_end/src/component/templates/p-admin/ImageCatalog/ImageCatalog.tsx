'use client';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense, useEffect, useState } from 'react';

import { FileWithPath } from '@mantine/dropzone';

const BaseTable = lazy(
  () => import('../../../modules/tables/BaseTable/Base.table'),
);

import BaseImageUpload from '@/component/modules/inputs/BaseImageUpload/BaseImageUpload.input';

import {
  getImageCatalogApi,
  IImageCatalog,
} from '@/data/server_request/dashboard/blogs';
import {
  PaginationWithDataType,
  submitImageFileApi,
} from '@/data/server_request/dashboard/product';
import { ImageCatalogColumnsData } from './ImageCatalog.table';

import styles from './ImageCatalog.module.css';
import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';

const ImageCatalog = () => {
  const urlParams = useSearchParams()?.get('page') || '1';
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [allImageCatalogData, setAllImageCatalogData] =
    useState<PaginationWithDataType<IImageCatalog>>();

  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

  const callGetImageCatalogApi = async () => {
    try {
      const result = await getImageCatalogApi(Number(urlParams));
      setAllImageCatalogData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetImageCatalogApi();
  }, [urlParams]);

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
      callGetImageCatalogApi();
    } catch (error) {
      // console.log(error);
    } finally {
      setIsUploadImageLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <>
      <div className={styles.RegisterMain}>
        <div className={styles.nameSection}>
          <span>ایجاد کاتالوگ</span>
        </div>
        <form>
          <div className={styles.form}>
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
        </form>
        <Suspense>
          <BaseTable
            loadingCount={3}
            isLoading={isLoading}
            columns={ImageCatalogColumnsData(callGetImageCatalogApi)}
            data={allImageCatalogData?.results as IImageCatalog[]}
          />
        </Suspense>
        <BasePagination
          disabled={isLoading}
          onChange={handlePageChange}
          total={Math.ceil((allImageCatalogData?.count ?? 0) / 20)}
        />
      </div>
    </>
  );
};
export default ImageCatalog;

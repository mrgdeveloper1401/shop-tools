'use client';
import Link from 'next/link';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useCreatePostsBlogForm } from '@/hooks/formik/admin-dashboard/useCreatePostBlogFormik';

import { Loader } from '@mantine/core';
import Swal from 'sweetalert2';
import { FileWithPath } from '@mantine/dropzone';

import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import BaseMultiSelectSearchInput from '@/component/modules/inputs/BaseMultiSelectSearchInput/BaseMultiSelectSearch.input';
import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';
import BlogEditor from '../BlogEditor/BlogPost';
import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import BaseImageUpload from '@/component/modules/inputs/BaseImageUpload/BaseImageUpload.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';

import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';

import {
  getAllUsersApi,
  getBlogPostApi,
  getBlogTagApi,
  IAllUsers,
  IBlogPostsArticle,
  IBlogTags,
  submitBlogPostApi,
} from '@/data/server_request/dashboard/blogs';
import { BlogPostColumnsData } from './BlogPost.table';
import { showSwal } from '@/utils/swalHelper';
import {
  PaginationWithDataType,
  submitImageFileApi,
} from '@/data/server_request/dashboard/product';

import styles from './BlogPost.module.css';

const BlogPost = () => {
  const { blogid } = useParams();

  const urlParams = useSearchParams()?.get('page') || '1';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);

  const [allTagsData, setAllTagsData] = useState<IBlogTags[]>([]);
  const [allAutorInfoData, setAllAutorInfoData] = useState<IAllUsers[]>([]);
  const [allBlogPostData, setAllBlogPostData] =
    useState<PaginationWithDataType<IBlogPostsArticle>>();

  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
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
        setIsUploadLoading(true);
        try {
          const result = await submitBlogPostApi(Number(blogid), values);
          if (result.status === 201 || result.status === 200) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetBlogPostApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        } finally {
          setIsUploadLoading(false);
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useCreatePostsBlogForm(submitHandler);

  const callGetBlogPostApi = async () => {
    try {
      const result = await getBlogPostApi(Number(blogid), Number(urlParams));
      setAllBlogPostData(result);

      const resultAutorInfo = await getAllUsersApi();
      setAllAutorInfoData(resultAutorInfo);

      const resultTags = await getBlogTagApi();
      setAllTagsData(resultTags);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetBlogPostApi();
    setFieldValue('category', blogid);
  }, []);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

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
      setFieldValue('post_cover_image', result.id);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsUploadImageLoading(false);
    }
  };

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد مقاله</span>
        <Link href="/p-admin/blogs/create-post/tags">
          <PrimaryButton>ایجاد تگ جدید</PrimaryButton>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="post_title"
              value={values.post_title}
              error={errors.post_title}
              label="عنوان مقاله"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              name="read_time"
              value={values.read_time || ''}
              error={errors.read_time}
              label="مدت زمان مطالعه"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextArea
              value={values.post_introduction}
              name="post_introduction"
              label="مقدمه ی مقاله"
              rightSection={null}
              error={errors.post_introduction}
              onChange={(val) =>
                setFieldValue(
                  'post_introduction',
                  val.target.value.slice(0, 220),
                )
              }
            />
          </div>

          <div className={styles.input}>
            <BaseMultiSelectSearchInput
              errorProps={errors}
              name="author"
              rightSection={<ChevronDownIcon />}
              placeholder="نویسندگان را انتخاب کنید"
              withScrollArea={true}
              data={allAutorInfoData?.map((item: any, index: number) => ({
                value: String(item.id),
                label: `${index + 1}- ${item.mobile_phone}`,
              }))}
              onChange={(value: any) => setFieldValue('author', value)}
            />
          </div>
          <div className={styles.input}>
            <BaseMultiSelectSearchInput
              errorProps={errors}
              name="tags"
              rightSection={<ChevronDownIcon />}
              placeholder="تگ ها را انتخاب کنید"
              withScrollArea={true}
              data={allTagsData?.map((item: any, index: number) => ({
                value: String(item.id),
                label: `${index + 1} - ${item.tag_name}`,
              }))}
              onChange={(value: any) => setFieldValue('tags', value)}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              name="post_slug"
              value={values.post_slug}
              error={errors.post_slug}
              label="post_slug"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextArea
              name="description_slug"
              value={values.description_slug}
              error={errors.description_slug}
              label="description_slug"
              rightSection={null}
              onChange={(val) =>
                setFieldValue(
                  'description_slug',
                  val.target.value.slice(0, 220),
                )
              }
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
          </div>
          <PrimaryButton
            size="md"
            type="submit"
            variant="primary"
            leftSection={isUploadLoading && <Loader size="sm" color="#ffff" />}
          >
            افزودن مقاله
          </PrimaryButton>
        </div>
      </form>

      <BlogEditor setFieldValue={setFieldValue} />

      <Suspense>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={BlogPostColumnsData(
            Number(blogid),
            allAutorInfoData,
            allTagsData,
            callGetBlogPostApi,
          )}
          data={allBlogPostData?.results as any}
        />
      </Suspense>
      <BasePagination
        disabled={isLoading}
        onChange={handlePageChange}
        total={Math.ceil((allBlogPostData?.count ?? 0) / 20)}
      />
    </div>
  );
};

export default BlogPost;

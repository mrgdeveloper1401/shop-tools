import { FC, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useCreatePostsBlogForm } from '@/hooks/formik/admin-dashboard/useCreatePostBlogFormik';
import { FileWithPath } from '@mantine/dropzone';

import Swal from 'sweetalert2';
import BaseImageUpload from '../../inputs/BaseImageUpload/BaseImageUpload.input';
import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import BaseMultiSelectSearchInput from '../../inputs/BaseMultiSelectSearchInput/BaseMultiSelectSearch.input';
import BaseTextArea from '../../inputs/BaseTextArea/BaseTextArea';
import BlogEditor from '@/component/templates/p-admin/BlogEditor/BlogPost';
import PrimaryButton from '../../PrimaryButton/Primary.button';

import ChevronDownIcon from '../../icons/ChevronDown.icon';
import EditIcon from '../../icons/Edit.icon';

import {
  getOneBlogPostApi,
  IAllUsers,
  IBlogTags,
  submitEditBlogPostApi,
} from '@/data/server_request/dashboard/blogs';
import { showSwal } from '@/utils/swalHelper';
import { submitImageFileApi } from '@/data/server_request/dashboard/product';

import styles from './BlogArticleEditButtonDrawer.module.css';

interface IBlogArticleEditButtonDrawerProps {
  postSlug: string;
  categoryId: number;
  callGetBlogPostApi: VoidFunction;
  allAutorInfoData: IAllUsers[];
  allTagsData: IBlogTags[];
}
const BlogArticleEditButtonDrawer: FC<IBlogArticleEditButtonDrawerProps> = ({
  postSlug,
  categoryId,
  callGetBlogPostApi,
  allAutorInfoData,
  allTagsData,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

  const submitHandler = async (values: any) => {
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
        setIsLoading(true);
        try {
          const res = await submitEditBlogPostApi(postSlug, categoryId, values);
          if (res.status === 200) {
            Swal.fire({
              title: ' با موفقیت ادیت گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            }).then(() => {
              close();
              callGetBlogPostApi();
            });
          }
        } catch (error) {
          // console.log(error);
          showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useCreatePostsBlogForm(submitHandler);

  const callGetApi = async () => {
    try {
      const resultBlogPost = await getOneBlogPostApi(postSlug, categoryId);

      setFieldValue('post_title', resultBlogPost?.post_title || '');
      setFieldValue('post_slug', resultBlogPost?.post_slug || '');
      setFieldValue(
        'post_introduction',
        resultBlogPost?.post_introduction || '',
      );
      setFieldValue('post_body', resultBlogPost?.post_body || '');
      setFieldValue('read_time', resultBlogPost?.read_time || 0);
      setFieldValue('post_cover_image', resultBlogPost?.post_cover_image || '');
      setFieldValue('description_slug', resultBlogPost?.post_slug || '');
      setFieldValue(
        'author',
        resultBlogPost?.author.map((item) => String(item.id)) || [],
      );
      setFieldValue(
        'tags',
        resultBlogPost?.tags.map((item) => String(item.id)) || [],
      );
    } catch (error) {
      // console.log()
    }
  };

  useEffect(() => {
    if (opened) {
      setFieldValue('category', categoryId);
      callGetApi();
    }
  }, [opened]);

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
    <>
      <BaseDrawer
        size="100%"
        title="ادیت مقاله"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
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
                value={values.read_time}
                error={errors.read_time}
                label="زمان مطالعه"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
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
                  label: `${index + 1}-${item?.mobile_phone}`,
                }))}
                value={values.author}
                onChange={(value: any) => setFieldValue('author', value)}
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
              <BaseTextArea
                value={values.post_introduction}
                name="post_introduction"
                label="مقدمه ی مقاله"
                rightSection={null}
                error={errors.post_introduction}
                styles={{ input: { height: '80px' } }}
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
                name="tags"
                rightSection={<ChevronDownIcon />}
                placeholder="تگ ها را انتخاب کنید"
                withScrollArea={true}
                data={allTagsData?.map((item: any, index: number) => ({
                  value: String(item.id),
                  label: `${index + 1} - ${item.tag_name}`,
                }))}
                value={values.tags}
                onChange={(value: any) => setFieldValue('tags', value)}
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
          <div className={styles.editor_container}>
            <BlogEditor
              value={values.post_body}
              setFieldValue={setFieldValue}
            />
          </div>

          <div className={styles.buttonContainer}>
            <PrimaryButton
              loading={isLoading}
              size="lg"
              variant="primary"
              type="submit"
            >
              تایید
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              variant="outline"
              type="button"
              onClick={close}
            >
              لغو
            </PrimaryButton>
          </div>
        </form>
      </BaseDrawer>
      <button
        onClick={() => {
          callGetApi();
          open();
        }}
      >
        <EditIcon />
      </button>
    </>
  );
};
export default BlogArticleEditButtonDrawer;

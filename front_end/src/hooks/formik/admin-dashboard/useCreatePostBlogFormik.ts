import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreatePostsBlogFormikValues = {
  post_introduction: string;
  is_active: boolean;
  description_slug: string;
  post_cover_image: string;
  read_time: number;
  post_body: string;
  tags: string[];
  author: string[];
  category: number;
  post_title: string;
  post_slug: string;
};

export const useCreatePostsBlogForm = (
  submitHandler: (values: ICreatePostsBlogFormikValues) => void,
) => {
  const validateSchema = yup.object({
    tags: yup.array().of(yup.string()).default([]),
    post_introduction: yup
      .string()
      .required('مقدمه پست را وارد کنید!')
      .default(''),
    post_title: yup.string().required('عنوان پست را وارد کنید!').default(''),
    post_slug: yup.string().required('slug پست را وارد کنید!').default(''),
    post_body: yup.string().required('متن پست را وارد کنید!').default(''),
    read_time: yup.number().required('زمان خواندن را وارد کنید!').default(0),
    category: yup.number().required('زمان خواندن را وارد کنید!').default(0),
    post_cover_image: yup
      .string()
      .required('تصویر کاور را وارد کنید!')
      .default(''),
    is_active: yup.boolean().default(true),
    description_slug: yup
      .string()
      .required('توضیحات slug را وارد کنید!')
      .default(''),
    author: yup.array().of(yup.string()).required().default([]),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreatePostsBlogFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

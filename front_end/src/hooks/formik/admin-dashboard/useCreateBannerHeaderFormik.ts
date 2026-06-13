import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateBannerHeaderFormikValues = {
  header_title: string;
  images: number[] | null;
  background_color: string;
  text_color: string;
  is_publish: boolean;
};
export const useCreateBannerHeaderForm = (
  submitHandler: (values: ICreateBannerHeaderFormikValues) => void,
) => {
  const validateSchema = yup.object({
    header_title: yup.string().required('عنوان را وارد کنید!').default(''),
    images: yup.array().of(yup.number()).nullable().default(null),
    background_color: yup
      .string()
      .required('رنگ پس زمینه را انتخاب کنید!')
      .default(''),
    text_color: yup.string().required('رنگ متن را انتخاب کنید!').default(''),
    is_publish: yup.boolean().default(true),
  });
  return useFormik({
    initialValues: validateSchema.getDefault() as any,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

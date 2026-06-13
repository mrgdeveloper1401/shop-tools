import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateCategoryBlogFormikValues = {
  category_name: string;
  category_slug: string;
};

export const useCreateCategoryBlogForm = (
  submitHandler: (values: ICreateCategoryBlogFormikValues) => void,
) => {
  const validateSchema = yup.object({
    category_name: yup
      .string()
      .required('نام دسته بندی را وارد کنید !')
      .default(''),
    category_slug: yup
      .string()
      .required('اسلاگ دسته بندی را وارد کنید !')
      .default(''),
  });

  return useFormik({
    initialValues:
      validateSchema.getDefault() as ICreateCategoryBlogFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type IEditCategoryBlogFormikValues = {
  category_name: string | null;
  category_slug: string | null;
};

export const useEditCategoryBlogForm = (
  submitHandler: (values: IEditCategoryBlogFormikValues) => void,
) => {
  const validateSchema = yup.object({
    category_name: yup
      .string()
      .required('نام دسته بندی را وارد کنید !')
      .nullable()
      .default(null),
    category_slug: yup
      .string()
      .required('اسلاگ دسته بندی را وارد کنید !')
      .nullable()
      .default(null),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IEditCategoryBlogFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

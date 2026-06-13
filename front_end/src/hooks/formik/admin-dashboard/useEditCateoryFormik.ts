import * as yup from 'yup';
import { useFormik } from 'formik';

export type IEditCategoryFormikValues = {
  category_name?: string | null;
  category_image?: number | null;
};

export const useEditCategoryForm = (
  submitHandler: (values: IEditCategoryFormikValues) => void,
) => {
  const validateSchema = yup.object({
    category_name: yup
      .string()
      .required('عنوان دسته بندی را وارد کنید!')
      .nullable()
      .default(null),
    category_image: yup
      .number()
      .required('عنوان دسته بندی را وارد کنید!')
      .nullable()
      .default(null),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IEditCategoryFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

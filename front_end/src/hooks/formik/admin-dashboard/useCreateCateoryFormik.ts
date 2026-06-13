import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateCategoryFormikValues = {
  category_name: string;
  category_image: number | null;
};

export const useCreateCategoryForm = (
  submitHandler: (values: ICreateCategoryFormikValues) => void,
) => {
  const validateSchema = yup.object({
    category_name: yup
      .string()
      .required('عنوان دسته بندی را وارد کنید!')
      .default(''),
    category_image: yup.number().nullable().default(null),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateCategoryFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type IEditBrandFormikValues = {
  brand_name: string | null;
  brand_image: number | null;
};

export const useEditBrandForm = (
  submitHandler: (values: IEditBrandFormikValues) => void,
) => {
  const validateSchema = yup.object({
    brand_name: yup
      .string()
      .required('عنوان برند را وارد کنید!')
      .nullable()
      .default(null),
    brand_image: yup
      .number()
      .required('عکس برند را وارد کنید!')
      .nullable()
      .default(null),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IEditBrandFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

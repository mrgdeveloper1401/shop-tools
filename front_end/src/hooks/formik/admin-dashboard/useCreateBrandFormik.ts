import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateBrandFormikValues = {
  brand_name: string;
  brand_image: number | null;
};

export const useCreateBrandForm = (
  submitHandler: (values: ICreateBrandFormikValues) => void,
) => {
  const validateSchema = yup.object({
    brand_name: yup.string().required('عنوان برند را وارد کنید!').default(''),
    brand_image: yup
      .number()
      .required('عکس برند را وارد کنید!')
      .nullable()
      .default(null),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateBrandFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

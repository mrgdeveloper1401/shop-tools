import * as yup from 'yup';
import { useFormik } from 'formik';

export type IShippingDetailFormikValues = {
  company: number;
  price: string;
  estimated_days: number;
  name: string;
  shipping_type: string;
  is_active: boolean;
};

export const useCreateShippingDetailForm = (
  submitHandler: (values: IShippingDetailFormikValues) => void,
) => {
  const validateSchema = yup.object({
    company: yup.number().required().default(0),
    price: yup.string().required().default(''),
    estimated_days: yup.number().required().default(0),
    name: yup
      .string()
      .required('عنوان شرکت حمل و نقل را وارد کنید!')
      .default('حمل ایران'),
    shipping_type: yup.string().required().default(''),
    is_active: yup.boolean().default(true),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IShippingDetailFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

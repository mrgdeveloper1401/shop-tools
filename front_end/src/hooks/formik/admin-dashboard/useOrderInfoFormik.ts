import * as yup from 'yup';
import { useFormik } from 'formik';

export type IOrderInfoFormikValues = {
  city: number;
  state: number;
  title: string;
  address_line: string;
  postal_code: string;
  is_default: boolean;
  company: number;
  price: string;
  name: string;
  estimated_days: number;
  shipping_type: string;
  is_active: boolean;
};

export const useOrderInfoForm = (
  submitHandler: (values: IOrderInfoFormikValues) => void,
) => {
  const validateSchema = yup.object({
    city: yup.number().required('شهر الزامی است').default(0),
    state: yup.number().required('استان الزامی است').default(0),
    title: yup.string().required('عنوان الزامی است').default(''),
    address_line: yup.string().required('آدرس الزامی است').default(''),
    postal_code: yup
      .string()
      .required('کد پستی الزامی است')
      .matches(/^[0-9]{10}$/, 'کد پستی باید 10 رقم باشد')
      .default(''),
    is_default: yup.boolean().default(true),
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
    initialValues: validateSchema.getDefault() as IOrderInfoFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

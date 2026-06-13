import * as yup from 'yup';
import { useFormik } from 'formik';

export type IAddAddressFormikValues = {
  city: number;
  state: number;
  title: string;
  address_line: string;
  postal_code: string;
  is_default: boolean;
};

export const useAddAddressForm = (
  submitHandler: (values: IAddAddressFormikValues) => void,
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
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IAddAddressFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

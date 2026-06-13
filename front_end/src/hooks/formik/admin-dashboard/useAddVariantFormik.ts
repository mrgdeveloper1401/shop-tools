import * as yup from 'yup';
import { useFormik } from 'formik';

export type IVariantFormikValues = {
  price: string;
  stock_number: number;
  is_active: boolean;
  name: string;
};

export const useAddVariantForm = (
  submitHandler: (values: IVariantFormikValues) => void,
) => {
  const validateSchema = yup.object({
    name: yup.string().required('متن الزامی است!').default(''),
    price: yup.string().required('قیمت الزامی است!').default(''),
    stock_number: yup
      .number()
      .min(1)
      .required('تعداد باید بیشتر از 1باشد!')
      .default(1),
    is_active: yup.boolean().required().default(true),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IVariantFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type IAddDiscountFormikValues = {
  product_variant: number;
  discount_type: string;
  amount: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

export const useAddDiscountForm = (
  submitHandler: (values: IAddDiscountFormikValues) => void,
) => {
  const validateSchema = yup.object({
    product_variant: yup
      .number()
      .required('محصول مورد نظر را انتخاب کنید')
      .default(0),
    discount_type: yup
      .string()
      .required('نوع تخفیف را انتخاب کنید')
      .default('percent'),
    amount: yup.string().required('مقدار تخفیف را وارد کنید!').default(''),
    start_date: yup.string().required('تاریخ شروع را وارد کنید').default(''),
    end_date: yup.string().required('تاریخ پایان را وارد کنید').default(''),
    is_active: yup.boolean().default(true),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IAddDiscountFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

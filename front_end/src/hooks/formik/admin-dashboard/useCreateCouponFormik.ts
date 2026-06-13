import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateCouponFormikValues = {
  code: string;
  valid_from: string;
  valid_to: string;
  coupon_type: string;
  amount: number;
  is_active: boolean;
  maximum_use: string;
};
export const useCreateCouponForm = (
  submitHandler: (values: ICreateCouponFormikValues) => void,
) => {
  const validateSchema = yup.object({
    code: yup.string().required('کد الزامی است').default(''),
    valid_from: yup.string().required('تاریخ شروع الزامی است').default(''),
    valid_to: yup.string().required('تاریخ پایان الزامی است').default(''),
    coupon_type: yup
      .string()
      .required('نوع کوپن الزامی است')
      .default('percent'),
    amount: yup
      .number()
      .required('مقدار الزامی است')
      .min(0, 'مقدار باید مثبت باشد')
      .default(0),
    is_active: yup
      .boolean()
      .required('وضعیت فعال بودن الزامی است')
      .default(true),
    maximum_use: yup.string().required('تعداد استفاده ').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateCouponFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

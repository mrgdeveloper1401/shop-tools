import * as yup from 'yup';
import { useFormik } from 'formik';

export type IForgetPassVerifyFormikValues = {
  mobile_phone: string;
  otp: string;
  password: string;
  confirm_password: string;
};

export const useForgetPassVerifyForm = (
  submitHandler: (values: IForgetPassVerifyFormikValues) => void,
) => {
  const validateSchema = yup.object({
    mobile_phone: yup.string().required('شماره تماس را وارد کنید!').default(''),
    otp: yup.string().required('کد نامعتبر می باشد!').default(''),
    password: yup
      .string()
      .required('رمز عبور الزامی است')
      .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد')
      .default(''),
    confirm_password: yup
      .string()
      .required('تکرار رمز عبور الزامی است')
      .oneOf([yup.ref('password')], 'رمز عبور و تکرار آن یکسان نیستند')
      .default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IForgetPassVerifyFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

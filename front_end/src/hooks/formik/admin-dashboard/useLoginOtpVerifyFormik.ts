import * as yup from 'yup';
import { useFormik } from 'formik';
export type ILoginOtpVerifyFormikValues = {
  code: string;
  phone: string;
};

export const useLoginOtpVerifyFormik = (
  submitHandler: (values: ILoginOtpVerifyFormikValues) => void,
) => {
  const validateSchema = yup.object({
    code: yup.string().required('کد را وارد کنید!').default(''),
    phone: yup.string().required('شماره تماس را وارد کنید!').default(''),
  });

  return useFormik({
    initialValues:
      validateSchema.getDefault() as unknown as ILoginOtpVerifyFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

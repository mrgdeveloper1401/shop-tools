import * as yup from 'yup';
import { useFormik } from 'formik';

export type ILoginUserPassFormikValues = {
  phone: string;
  password: string;
};
export const useLoginUserPassForm = (
  submitHandler: (values: ILoginUserPassFormikValues) => void,
) => {
  const validateSchema = yup.object({
    phone: yup.string().required('شماره تماس را وارد کنید!').default(''),
    password: yup.string().required('رمز خود را وارد کنید!').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ILoginUserPassFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

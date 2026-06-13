import * as yup from 'yup';
import { useFormik } from 'formik';

export type IForgetPassFormikValues = {
  mobile_phone: string;
};

export const useForgetPassForm = (
  submitHandler: (values: IForgetPassFormikValues) => void,
) => {
  const validateSchema = yup.object({
    mobile_phone: yup.string().required('شماره تماس را وارد کنید!').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IForgetPassFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

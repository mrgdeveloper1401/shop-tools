import * as yup from 'yup';
import { useFormik } from 'formik';

export type ILoginFormikValues = {
  mobile_phone: string;
};

export const useLoginForm = (
  submitHandler: (values: ILoginFormikValues) => void,
) => {
  const validateSchema = yup.object({
    mobile_phone: yup.string().required('شماره تماس را وارد کنید!').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ILoginFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type IEditProfileFormikValues = {
  first_name: string;
  last_name: string;
};

export const useEditProfileForm = (
  submitHandler: (values: IEditProfileFormikValues) => void,
) => {
  const validateSchema = yup.object({
    first_name: yup.string().required('نام خود را وارد کنید!').default(''),
    last_name: yup
      .string()
      .required('نام خانوادگی خود را وارد کنید!')
      .default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IEditProfileFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

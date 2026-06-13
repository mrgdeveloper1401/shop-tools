import * as yup from 'yup';
import { useFormik } from 'formik';

export type IEditUserFormikValues = {
  mobile_phone: string | null;
  username: string | null;
  email: string | null;
  is_active: boolean;
};

export const useEditUserForm = (
  submitHandler: (values: IEditUserFormikValues) => void,
) => {
  const validateSchema = yup.object({
    mobile_phone: yup
      .string()
      .required('شماره موبایل را وارد کنید!')
      .nullable()
      .default(null),
    username: yup.string().default(null),
    email: yup.string().email('ایمیل معتبر نیست!').nullable().default(null),
    is_active: yup.boolean().default(true),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IEditUserFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

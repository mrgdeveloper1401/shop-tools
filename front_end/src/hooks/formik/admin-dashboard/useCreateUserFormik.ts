import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateUserFormikValues = {
  mobile_phone: string;
  username: string;
  email: string | null;
  is_active: boolean;
};

export const useCreateUserForm = (
  submitHandler: (values: ICreateUserFormikValues) => void,
) => {
  const validateSchema = yup.object({
    mobile_phone: yup.string().required('شماره موبایل الزامی است').default(''),
    username: yup.string().required('نام کاربری الزامی است').default(''),
    email: yup.string().email('ایمیل نامعتبر است').nullable().default(null),
    is_active: yup.boolean().required('وضعیت الزامی است').default(true),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateUserFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

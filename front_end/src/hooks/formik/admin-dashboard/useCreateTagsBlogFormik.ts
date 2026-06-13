import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateTagsBlogFormikValues = {
  tag_name: string;
};
export const useCreateTagsBlogForm = (
  submitHandler: (values: ICreateTagsBlogFormikValues) => void,
) => {
  const validateSchema = yup.object({
    tag_name: yup.string().required('نام تگ را وارد کنید !').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateTagsBlogFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

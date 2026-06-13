import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateTagFormikValues = {
  tag_name: string;
  is_active: boolean;
};

export const useCreateTagForm = (
  submitHandler: (values: ICreateTagFormikValues) => void,
) => {
  const validateSchema = yup.object({
    tag_name: yup.string().required('عنوان تگ را وارد کنید!').default(''),
    is_active: yup.boolean().default(true),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateTagFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type IEditTagFormikValues = {
  tag_name: string;
};

export const useEditTagForm = (
  submitHandler: (values: IEditTagFormikValues) => void,
) => {
  const validateSchema = yup.object({
    tag_name: yup.string().required('عنوان تگ را وارد کنید!').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IEditTagFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

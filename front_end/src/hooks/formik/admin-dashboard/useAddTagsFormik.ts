import * as yup from 'yup';
import { useFormik } from 'formik';

export type IAddTagFormikValues = {
  id: string;
};

export const useAddTagForm = (
  submitHandler: (values: IAddTagFormikValues) => void,
) => {
  const validateSchema = yup.object({
    id: yup.string().required('تگ را انتخاب کنید!').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IAddTagFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type IShippingFormikValues = {
  name: string;
  is_active: boolean;
};

export const useCreateShippingForm = (
  submitHandler: (values: IShippingFormikValues) => void,
) => {
  const validateSchema = yup.object({
    name: yup
      .string()
      .required('عنوان شرکت حمل و نقل را وارد کنید!')
      .default(''),
    is_active: yup.boolean().default(true),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IShippingFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

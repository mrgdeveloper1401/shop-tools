import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateAttributeKeyFormikValues = {
  attribute_name: string;
};

export const useCreateAttributeKeyForm = (
  submitHandler: (values: ICreateAttributeKeyFormikValues) => void,
) => {
  const validateSchema = yup.object({
    attribute_name: yup
      .string()
      .required('عنوان ویژگی محصول را وارد کنید!')
      .default(''),
  });

  return useFormik({
    initialValues:
      validateSchema.getDefault() as ICreateAttributeKeyFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

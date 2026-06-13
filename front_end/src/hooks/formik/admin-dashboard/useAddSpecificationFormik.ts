import * as yup from 'yup';
import { useFormik } from 'formik';

export type ISpecificationFormikValues = {
  product: number;
  attribute: number;
  value: string;
};

export const useAddSpecificationForm = (
  submitHandler: (values: ISpecificationFormikValues) => void,
) => {
  const validateSchema = yup.object({
    attribute: yup.number().required('متن الزامی است!').default(0),
    value: yup.string().required('توضیح الزامی است!').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ISpecificationFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

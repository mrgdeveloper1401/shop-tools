import * as yup from 'yup';
import { useFormik } from 'formik';

export type IAddImageFormikValues = {
  image: File | null;
  order: string;
  is_active: boolean;
  alt_text_image: string;
  product: number;
};

export const useAddImageForm = (
  submitHandler: (values: IAddImageFormikValues) => void,
) => {
  const validateSchema = yup.object({
    product: yup.number().required().default(0),
    image: yup.mixed().nullable().default(null),
    order: yup.string().required().default(''),
    is_active: yup.boolean().required().default(true),
    alt_text_image: yup.string().required().default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IAddImageFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

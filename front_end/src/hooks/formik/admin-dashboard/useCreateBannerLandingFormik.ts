import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateBannerLandingFormikValues = {
  image: number;
  name: string;
};
export const useCreateBannerLandingForm = (
  submitHandler: (values: ICreateBannerLandingFormikValues) => void,
) => {
  const validateSchema = yup.object({
    image: yup.number().required('عنوان بنر را وارد کنید!').default(0),
    name: yup.string().required('عنوان بنر را وارد کنید!').default(''),
  });
  return useFormik({
    initialValues: validateSchema.getDefault() as any,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

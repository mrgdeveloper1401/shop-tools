import * as yup from 'yup';
import { useFormik } from 'formik';

export type IChartFormikValues = {
  start_date: string;
  end_date: string;
};

export const useChartForm = (
  submitHandler: (values: IChartFormikValues) => void,
) => {
  const validateSchema = yup.object({
    start_date: yup.string().required('شماره تماس را وارد کنید!').default(''),
    end_date: yup.string().required('شماره تماس را وارد کنید!').default(''),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IChartFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type ISiteMapFormikFormikValues = {
  slug_text: string;
  last_modified: string;
  changefreq: string;
  priority: number;
};

export const useSiteMapFormikForm = (
  submitHandler: (values: ISiteMapFormikFormikValues) => void,
) => {
  const validateSchema = yup.object({
    slug_text: yup.string().required('متن اسلاگ الزامی است').default(''),
    last_modified: yup
      .string()
      .required('تاریخ آخرین تغییر الزامی است')
      .default(''),
    changefreq: yup.string().required('فرکانس تغییر الزامی است').default(''),
    priority: yup.number().required('اولویت الزامی است').default(0.5),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ISiteMapFormikFormikValues,

    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';

export type IBaSalamFormikValues = {
  name: string;
  category_id: number;
  status: number;
  primary_price: number;
  stock: number;
  description: string;
  photo: number;
  sku: string;
  is_wholesale: boolean;
  package_weight: number;
  preparation_days: number;
  weight: number;
};

export const useAddBaSalamForm = (
  submitHandler: (values: IBaSalamFormikValues) => void,
) => {
  const validateSchema = yup.object({
    name: yup.string().required('نام را وارد کنید!').default(''),
    category_id: yup.number().required('دسته‌بندی را وارد کنید!').default(0),
    status: yup.number().required('وضعیت را وارد کنید!').default(0),
    primary_price: yup.number().required('قیمت اولیه را وارد کنید!').default(0),
    stock: yup.number().required('موجودی را وارد کنید!').default(0),
    description: yup.string().required('توضیحات را وارد کنید!').default(''),
    photo: yup.number().required('عکس‌ها را وارد کنید!').default(0),
    sku: yup.string().required('کد SKU را وارد کنید!').default(''),
    is_wholesale: yup.boolean().default(false),
    package_weight: yup
      .number()
      .required('قیمت اولیه را وارد کنید!')
      .default(150),
    preparation_days: yup
      .number()
      .required('قیمت اولیه را وارد کنید!')
      .default(2),
    weight: yup.number().required('قیمت اولیه را وارد کنید!').default(100),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as IBaSalamFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

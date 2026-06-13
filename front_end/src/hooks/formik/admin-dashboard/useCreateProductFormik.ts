import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateProductFormikValues = {
  product_name: string;
  description: string;
  is_active: boolean;
  category: number;
  product_brand: number;
  tags: string[];
  sku: string;
  in_person_purchase: boolean;
};

export const useCreateProductForm = (
  submitHandler: (values: ICreateProductFormikValues) => void,
) => {
  const validateSchema = yup.object({
    product_name: yup
      .string()
      .required('عنوان محصول را وارد کنید!')
      .default(''),
    description: yup.string().required('توضیحات را وارد کنید!').default(''),
    sku: yup.string().required('شناسه را وارد کنید!').default(''),
    is_active: yup.boolean().default(true),
    category: yup.number().required('دسته بندی را انتخاب کنید!').default(0),
    product_brand: yup.number().required('برند محصول را وارد کنید!').default(0),
    tags: yup.array().of(yup.string()).default([]),
    in_person_purchase: yup.boolean().default(false),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateProductFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

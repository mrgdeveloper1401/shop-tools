import * as yup from 'yup';
import { useFormik } from 'formik';

export type ICreateCommentFormikValues = {
  comment_body: string;
  parent: number | undefined;
};

export const useCreateCommentForm = (
  submitHandler: (values: ICreateCommentFormikValues) => void,
) => {
  const validateSchema = yup.object({
    comment_body: yup.string().required('نظر خود را بنویسید!').default(''),
    parent: yup.number().default(undefined),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as any,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

import * as yup from 'yup';
import { useFormik } from 'formik';
export type ICreateTicketRoomFormikValues = {
  title_room: string;
  subject_room: string;
  is_close: boolean;
};

export const useCreateTicketRoomForm = (
  submitHandler: (values: ICreateTicketRoomFormikValues) => void,
) => {
  const validateSchema = yup.object({
    title_room: yup.string().required('عنوان را وارد کنید').default(''),
    subject_room: yup.string().default('پشتیبانی'),
    is_close: yup.boolean().default(false),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateTicketRoomFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler,
  });
};

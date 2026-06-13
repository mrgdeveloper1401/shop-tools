import * as yup from "yup";
import { useFormik } from "formik";

export type ICreateTicketChatFormikValues = {
  ticket_body: string,
  ticket_file: File | undefined;
};

export const useCreateTicketChatForm = (
  submitHandler: (values: ICreateTicketChatFormikValues) => void
) => {
  const validateSchema = yup.object({
    ticket_file: yup.mixed<File>().default(undefined),
    ticket_body: yup.string().required("عنوان را وارد کنید!").default(""),
  });

  return useFormik({
    initialValues: validateSchema.getDefault() as ICreateTicketChatFormikValues,
    validateOnChange: false,
    validationSchema: validateSchema,
    onSubmit: submitHandler
  });
};
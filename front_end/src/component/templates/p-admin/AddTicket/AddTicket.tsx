'use client';

import { FC, useEffect, useState } from 'react';
import { Notifications, notifications } from '@mantine/notifications';
import { useCreateTicketChatForm } from '@/hooks/formik/admin-dashboard/useCreateTicketChatFormik';

import Swal from 'sweetalert2';
import { Loader } from '@mantine/core';

import ConfirmIcon from '@/component/modules/icons/Confirm.icon';
import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';
import CircleIcon from '@/component/modules/icons/Circle.icon';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import DownloadIcon from '@/component/modules/icons/Download.icon';
import SendIcon from '@/component/modules/icons/Send.icon';
import PaperclipIcon from '@/component/modules/icons/Paperclip.icon';
import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';

import {
  getTicketChatApi,
  ITicketChat,
  submitTicketChatApi,
} from '@/data/server_request/dashboard/ticket';
import { convertToJalali, convertUTCToIranISO } from '@/utils/dateConvertUtils';

import styles from './AddTicket.module.css';

interface AddTicketSectionProps {
  OnIsClosed: (isClosed: boolean) => void;
  isClosed: boolean;
  ticketId: number;
  isAdmin: boolean;
}
const AddTicketSection: FC<AddTicketSectionProps> = ({
  OnIsClosed,
  isClosed,
  ticketId,
  isAdmin,
}) => {
  const [allTicketChatData, setAllTicketChatData] = useState<ITicketChat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);

  const submitHandler = async (values: any) => {
    setIsLoadingUpload(true);

    try {
      const result = await submitTicketChatApi(ticketId, values);

      if (result.status === 201) {
        notifications.show({
          title: 'پیام شما ارسال گردید.',
          message: '',
          radius: 'md',
          color: 'violet',
          icon: <ConfirmIcon strokeWidth={2} />,
        });
        resetInput();
        callGetApi();
      }
      if (result.status === 400) {
        Swal.fire('چت روم جدید را باز کنید!', '', 'error');
      }
    } catch (error) {
      Swal.fire('مجددا تلاش کنید', '', 'error');
    } finally {
      setIsLoadingUpload(false);
    }
  };
  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useCreateTicketChatForm(submitHandler);

  const callGetApi = async () => {
    try {
      const result = await getTicketChatApi(Number(ticketId));
      setAllTicketChatData(result);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const resetInput = () => {
    values.ticket_body = '';
    values.ticket_file = undefined;
  };

  useEffect(() => {
    callGetApi();
  }, [ticketId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFieldValue('ticket_file', file);
  };

  return (
    <>
      <Notifications />

      <div className={styles.nameSection}>
        {isClosed && (
          <button className={styles.back_btn} onClick={() => OnIsClosed(false)}>
            <ChevronDownIcon style={{ rotate: '270deg' }} />
            <span>برگشت</span>
          </button>
        )}
        <span>چت باکس</span>
      </div>

      <div className={styles.ticket_chat_container}>
        <div className={styles.ticket_chat_box}>
          {isLoading ? (
            <div className="flex justify-center h-full items-center">
              <Loader size="md" color="#8093ad" />
            </div>
          ) : (
            <>
              {(() => {
                if (isAdmin) {
                  return (
                    <>
                      {allTicketChatData.map((item) => (
                        <div
                          key={item.id}
                          className={styles.ticket_chat_message}
                        >
                          <div
                            className={
                              item.sender_is_staff
                                ? styles.message_user_container
                                : styles.message_support_container
                            }
                          >
                            <div
                              className={`${styles.message} ${
                                item.sender_is_staff
                                  ? styles.message_user
                                  : styles.message_support
                              }`}
                            >
                              <div className={styles.nameInfo}>
                                <CircleIcon />
                                <span>
                                  {item.sender_is_staff
                                    ? 'پشتیبانی'
                                    : item.sender_name}
                                </span>
                              </div>
                              <p>{item.ticket_body}</p>
                              {item.ticket_file && (
                                <div className={styles.fileDownload}>
                                  <PrimaryButton
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                      const fileUrl = item.ticket_file;
                                      const link = document.createElement('a');
                                      link.href = fileUrl;
                                      link.click();
                                    }}
                                  >
                                    <DownloadIcon
                                      style={{
                                        marginLeft: '5px',
                                        color: '#9d99ae',
                                      }}
                                    />
                                    فایل پیوست
                                  </PrimaryButton>
                                </div>
                              )}

                              <div className={styles.dateInfo}>
                                <span>{convertToJalali(item.created_at)}</span>
                                <span>
                                  {convertUTCToIranISO(item.created_at).slice(
                                    11,
                                    19,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  );
                }
                return (
                  <>
                    {allTicketChatData.map((item) => (
                      <div key={item.id} className={styles.ticket_chat_message}>
                        <div
                          className={
                            !item.sender_is_staff
                              ? styles.message_user_container
                              : styles.message_support_container
                          }
                        >
                          <div
                            className={`${styles.message} ${
                              !item.sender_is_staff
                                ? styles.message_user
                                : styles.message_support
                            }`}
                          >
                            <div className={styles.nameInfo}>
                              <CircleIcon />
                              <span>
                                {item.sender_is_staff ? 'پشتیبانی' : 'شما'}
                              </span>
                            </div>
                            <p>{item.ticket_body}</p>
                            {item.ticket_file && (
                              <div className={styles.fileDownload}>
                                <PrimaryButton
                                  variant="outline"
                                  size="lg"
                                  onClick={() => {
                                    const fileUrl = item.ticket_file;
                                    const link = document.createElement('a');
                                    link.href = fileUrl;
                                    link.click();
                                  }}
                                >
                                  <DownloadIcon
                                    style={{
                                      marginLeft: '5px',
                                      color: '#9d99ae',
                                    }}
                                  />
                                  فایل پیوست
                                </PrimaryButton>
                              </div>
                            )}

                            <div className={styles.dateInfo}>
                              <span>{convertToJalali(item.created_at)}</span>
                              <span>
                                {convertUTCToIranISO(item.created_at).slice(
                                  11,
                                  19,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </>
          )}
        </div>

        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.buttonContainer}>
              <button type="button"></button>
              <button type="submit">
                {isLoadingUpload ? (
                  <Loader size="sm" color="#8093ad" />
                ) : (
                  <SendIcon className={styles.sendText} />
                )}
              </button>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  multiple={false}
                  id="fileInput_answer"
                />
                <label
                  htmlFor="fileInput_answer"
                  className={styles.fileInputLabel}
                >
                  <PaperclipIcon />
                </label>
              </div>
            </div>
            <div className={styles.input}>
              <BaseTextArea
                name="ticket_body"
                placeholder="متن تیکت"
                value={values.ticket_body}
                onChange={handleChange}
                rightSection={null}
                error={errors.ticket_body}
                styles={{
                  input: {
                    height: '50px',
                    outline: 'none',
                    background: '#fff',
                  },
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTicketSection;

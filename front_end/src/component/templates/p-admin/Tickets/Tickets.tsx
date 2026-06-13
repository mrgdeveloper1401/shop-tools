'use client';
import { Suspense, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCreateTicketRoomForm } from '@/hooks/formik/admin-dashboard/useCreateTicketRoomFormik';
import { Notifications, notifications } from '@mantine/notifications';
import Swal from 'sweetalert2';

import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import BaseTable from '@/component/modules/tables/BaseTable/Base.table';
import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import BaseSelectInput from '@/component/modules/inputs/BaseSelectInput/BaseSelect.input';
import BaseModal from '@/component/modules/modals/BaseModal/Base.modal';
import AddTicketSection from '../AddTicket/AddTicket';

import ConfirmIcon from '@/component/modules/icons/Confirm.icon';
import TicketCloseDropdown from '@/component/modules/dropdown/TicketCloseDropdown/TicketCloseDropdown';
import TrashIcon from '@/component/modules/icons/Trash.icon';
import PlusIcon from '@/component/modules/icons/Plus.icon';

import {
  deleteTicketApi,
  getTicketsApi,
  ITicket,
  submitTicketApi,
  submitTicketRoomApi,
} from '@/data/server_request/dashboard/ticket';
import { showSwal } from '@/utils/swalHelper';
import { convertToJalali, convertUTCToIranISO } from '@/utils/dateConvertUtils';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';

import styles from './Tickets.module.css';

const Tickets = () => {
  const urlParams = useSearchParams()?.get('page') || '1';

  const pathUrl = usePathname();
  const isAdmin = pathUrl ? pathUrl.startsWith('/p-admin/') : false;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isClosed, setIsClosed] = useState(false);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [allTicketsData, setAllTicketsData] =
    useState<PaginationWithDataType<ITicket>>();

  const searchParams = useSearchParams();
  const orderValue = searchParams.get('IsClose') || '';

  const callGetApi = async () => {
    try {
      const result = await getTicketsApi(Number(urlParams), orderValue);
      setAllTicketsData(result);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    callGetApi();
  }, [orderValue]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  const callDeleteTicketHandler = (TicketsId: number) => {
    Swal.fire({
      title: 'آیا از افزدون مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await deleteTicketApi(Number(TicketsId));
        if (result.status === 204) {
          showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetApi();
        } else {
          showSwal('خطا', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const submitTicketHandler = (ticketsId: number, close: boolean) => {
    Swal.fire({
      title: 'آیا از تغییر مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await submitTicketApi(Number(ticketsId), {
          is_close: !close,
        });
        if (result.status === 200) {
          showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
          notifications.show({
            title: 'با موفقیت انجام گردید.',
            message: '',
            radius: 'md',
            color: 'violet',
            icon: <ConfirmIcon strokeWidth={2} />,
          });

          callGetApi();
        } else {
          showSwal('خطا', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const TicketsColumnsData = (isAdmin: boolean) => {
    const columns = [
      {
        key: 'id',
        header: 'شماره',
        hasFilter: null,
      },
      {
        key: 'title_room',
        header: 'تیکت ها',
        hasFilter: null,
        render: (props: any) => <p>{props.title_room?.slice(0, 20)}</p>,
      },
      {
        key: 'subject_room',
        header: 'ارجاع',
        hasFilter: null,
        render: (props: any) => (
          <div className={styles.td}>
            <p>{props.subject_room}</p>
          </div>
        ),
      },
      {
        key: 'created_at',
        header: 'تاریخ ثبت',
        hasFilter: null,
        render: (props: any) => (
          <div className={styles.td}>
            <p>
              {props.created_at
                ? `${convertUTCToIranISO(props.created_at).slice(11, 19)} - ${convertToJalali(
                    props.created_at,
                  )} `
                : 'نامشخص'}
            </p>
          </div>
        ),
      },
      {
        key: 'is_close',
        header: 'وضعیت',
        hasFilter: <TicketCloseDropdown />,
        render: (props: any) => (
          <div className={styles.td}>
            <PrimaryButton
              styles={{ root: { minWidth: '159px' } }}
              variant="outline"
              onClick={() => submitTicketHandler(props.id, props.is_close)}
            >
              {props.is_close ? 'شروع مجدد' : 'اتمام تیکت'}
            </PrimaryButton>
          </div>
        ),
      },
      {
        key: 'no1',
        header: 'مشاهده',
        hasFilter: null,
        render: (props: any) => (
          <div className={styles.td}>
            <PrimaryButton
              styles={{ root: { minWidth: '159px' } }}
              onClick={() => {
                setTicketId(props.id);
                setIsClosed(true);
              }}
            >
              مشاهده
            </PrimaryButton>
          </div>
        ),
      },
    ];

    if (isAdmin) {
      columns.push({
        key: 'no',
        header: 'حذف',
        hasFilter: null,
        render: (props: any) => (
          <div className={styles.td}>
            <button onClick={() => callDeleteTicketHandler(props.id)}>
              <TrashIcon />
            </button>
          </div>
        ),
      });
    }

    return columns;
  };

  return (
    <div className={styles.containerTicket}>
      <Notifications />

      <div
        className={`${isClosed ? styles.TicketsClosed : styles.TicketsMain}`}
      >
        <div className={styles.nameSection}>
          <span>تیکت ها</span>
          {!isAdmin && (
            <div>
              <CreateNewTicketModal callGetApi={callGetApi} />
            </div>
          )}
        </div>
        <Suspense>
          <BaseTable
            loadingCount={3}
            isLoading={isLoading}
            columns={TicketsColumnsData(isAdmin)}
            data={allTicketsData?.results as any}
          />
        </Suspense>
        <BasePagination
          disabled={isLoading}
          onChange={handlePageChange}
          total={Math.ceil((allTicketsData?.count ?? 0) / 20)}
        />
      </div>
      <div
        className={` ${
          isClosed ? styles.TicketsChatFull : styles.TicketChatHide
        }`}
      >
        {ticketId && (
          <AddTicketSection
            ticketId={ticketId}
            OnIsClosed={setIsClosed}
            isClosed={isClosed}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default Tickets;

const CreateNewTicketModal = ({ callGetApi }: { callGetApi: VoidFunction }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const submitHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از ایجاد تیکت  مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await submitTicketRoomApi(values);

          if (result.status === 201) {
            notifications.show({
              title: 'چت باکس ایجاد گردید.',
              message: '',
              radius: 'md',
              color: 'violet',
              icon: <ConfirmIcon strokeWidth={2} />,
            });

            callGetApi();
            close();
          }
        } catch (error) {
          Swal.fire('مجددا تلاش کنید', '', 'error');
        }
      }
    });
  };

  const { values, errors, handleSubmit, handleChange, setFieldValue } =
    useCreateTicketRoomForm(submitHandler);
  return (
    <>
      <BaseModal
        opened={opened}
        onClose={close}
        size={600}
        title="ایجاد تیکت جدید"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                label="موضوع تیکت"
                name="title_room"
                value={values.title_room}
                error={errors.title_room}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseSelectInput
                name="student_status"
                comboboxProps={{ position: 'bottom' }}
                placeholder="پشتیبانی"
                autoComplete="off"
                data={[
                  { value: 'هیچکدام', label: 'هیچکدام' },
                  { value: 'پشتیبانی', label: 'پشتیبانی' },
                  { value: 'ثبت سفارش', label: 'ثبت سفارش' },
                  { value: 'مالی', label: 'مالی' },
                ]}
                onChange={(k, v) => setFieldValue('subject_room', k)}
                value={values.subject_room}
                error={errors.subject_room}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <PrimaryButton
              size="md"
              className={styles.btn}
              variant="primary"
              type="submit"
            >
              ثبت و ارسال
            </PrimaryButton>
          </div>
        </form>
      </BaseModal>
      <PrimaryButton
        leftSection={<PlusIcon />}
        onClick={open}
        size="lg"
        type="button"
      >
        ارسال تیکت جدید
      </PrimaryButton>
    </>
  );
};

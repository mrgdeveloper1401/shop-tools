import getToken from '@/utils/getToken';
import axios from 'axios';
import { PaginationWithDataType } from './product';

export interface INotification {
  id: number;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
  notif_type: string;
  notifi_redirect_url: string;
}

const getNotificationApi = async (
  page: number,
  isRead: boolean,
): Promise<PaginationWithDataType<INotification>> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      is_read: isRead ? 'true' : 'false',
    }).toString();

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/private_notification/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Notifications');
  }
};

const submitNotificationApi = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/private_notification`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,

          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return error.response.data.message[0];
    } else {
      throw new Error('خطایی رخ داده است.');
    }
  }
};

const submitEditNotificationApi = async (notifId: number, formBody: any) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/private_notification/${notifId}/`,
      formBody,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    } else {
      throw new Error('An error occurred');
    }
  }
};

export { getNotificationApi, submitEditNotificationApi, submitNotificationApi };

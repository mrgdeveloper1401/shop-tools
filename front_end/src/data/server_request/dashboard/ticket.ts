//Ticket Room

import getToken from '@/utils/getToken';
import axios from 'axios';
import { PaginationWithDataType } from './product';

export interface ITicket {
  id: number;
  title_room: string;
  subject_room: string;
  is_close: boolean;
  created_at: string;
}

const getTicketsApi = async (
  pageIndex: number,
  orderValue: string,
): Promise<PaginationWithDataType<ITicket>> => {
  const queryParams = new URLSearchParams({
    page: pageIndex.toString(),
    close: orderValue,
  }).toString();
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/ticket_room/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Comments in class');
  }
};

const submitTicketRoomApi = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/ticket_room/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
          'Content-Type': 'application/json',
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

const submitTicketApi = async (ticketId: number, formData: any) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/ticket_room/${ticketId}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
          'Content-Type': 'application/json',
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

const deleteTicketApi = async (ticketId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/ticket_room/${ticketId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// Get ticket messages

export interface ITicketChat {
  id: number;
  ticket_body: string;
  ticket_file: string;
  created_at: string;
  sender_name: string;
  sender: number;
  sender_is_staff: boolean;
}

const getTicketChatApi = async (ticketId: number): Promise<ITicketChat[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/ticket_room/${ticketId}/ticket/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch ');
  }
};

const submitTicketChatApi = async (ticketId: number, formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/ticket_room/${ticketId}/ticket/`,
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

export {
  getTicketsApi,
  submitTicketRoomApi,
  submitTicketApi,
  deleteTicketApi,
  getTicketChatApi,
  submitTicketChatApi,
};

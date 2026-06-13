import axios from 'axios';
import getToken from '@/utils/getToken';
import { PaginationWithDataType } from './product';

export interface IUser {
  id: number;
  mobile_phone: string;
  username: string;
  email: string;
  is_active: boolean;
}

const getAllUsers = async (
  currentPage: number,
  mobile?: string,
): Promise<PaginationWithDataType<IUser>> => {
  const queryParams = new URLSearchParams({
    page: currentPage?.toString(),
    ...(mobile && { mobile_phone: mobile }),
  }).toString();
  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_information/?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return result.data;
};

const submitUserApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_information/`,
    FormBody,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};

const submitEditUserApi = async (userId: number, formBody: any) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_information/${userId}/`,
      JSON.stringify(formBody),
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
          'Content-Type': 'application/json',
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

const deleteUserApi = async (userId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_information/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

export { getAllUsers, submitUserApi, submitEditUserApi, deleteUserApi };

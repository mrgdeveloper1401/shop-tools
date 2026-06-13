import getToken from '@/utils/getToken';
import axios from 'axios';
import { PaginationWithDataType } from './product';

export interface IProfile {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: number;
  image: string;
  profile_image_url: string;
}

const getProfileApi = async (): Promise<IProfile[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Profiles');
  }
};

const submitEditProfileApi = async (userId: number, FormBody: any) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile/${userId}/`,
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

// -----Address----

export interface IAddress {
  id: number;
  city: number;
  state: number;
  title: string;
  address_line: string;
  postal_code: string;
  is_default: boolean;
  city_name: string;
}
const getAddressApi = async (): Promise<IAddress[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_address/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Profiles');
  }
};

const getOneAddressApi = async (id: number): Promise<IAddress> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_address/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Profiles');
  }
};

const submitAddressApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_address/`,
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

const deleteAddressApi = async (userId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user_address/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// -----City State----

export interface IState {
  id: number;
  name: string;
}

const getStateApi = async (): Promise<IState[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/state/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    return [];
  }
};

export interface ICity {
  id: number;
  name: string;
}

const getCityApi = async (stateID: number): Promise<ICity[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/state/${stateID}/city/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    return [];
  }
};

// -----Message----

export interface IMessage {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

const getMessageUserApi = async (): Promise<
  PaginationWithDataType<IMessage>
> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/private_notification/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch Profiles');
  }
};

export {
  getProfileApi,
  submitEditProfileApi,
  getAddressApi,
  getOneAddressApi,
  submitAddressApi,
  deleteAddressApi,
  getMessageUserApi,
  getCityApi,
  getStateApi,
};

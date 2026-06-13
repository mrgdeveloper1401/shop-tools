import getToken from '@/utils/getToken';
import axios from 'axios';

// -----shipping----

export interface IShipping {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  is_active: boolean;
}

const getShippingApi = async (): Promise<IShipping[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/shipping_company/`,
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

const submitShippingApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/shipping_company/`,
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

const deleteShippingApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/shipping_company/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// -----shippingDetail----

export interface IShippingDetail {
  id: number;
  company: any;
  price: string;
  estimated_days: number;
  name: string;
  shipping_type: string;
}

const getShippingDetailApi = async (): Promise<IShippingDetail[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/shipping_method/`,
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

const getOneShippingDetailApi = async (
  id: number,
): Promise<IShippingDetail> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/shipping_method/${id}/`,
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

const submitShippingDetailApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/shipping_method/`,
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

const deleteShippingDetailApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/shipping_method/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

export {
  getShippingApi,
  getOneShippingDetailApi,
  submitShippingApi,
  deleteShippingApi,
  getShippingDetailApi,
  submitShippingDetailApi,
  deleteShippingDetailApi,
};

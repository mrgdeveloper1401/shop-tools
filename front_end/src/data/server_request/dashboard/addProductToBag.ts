import axios from 'axios';
import getToken from '@/utils/getToken';

export interface IAddProductToBag {}

const getAddProductToBagApi = async (): Promise<IAddProductToBag[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/`, {
    headers: {
      Authorization: `Bearer ${getToken()?.token.access}`,
    },
  });

  return res.data;
};

const submitAddProductToBagApi = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/products/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
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

const submitEditAddProductToBagApi = async (id: number, formBody: any) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${id}/`,
      formBody,
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

const deleteAddProductToBagApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

export {
  getAddProductToBagApi,
  submitAddProductToBagApi,
  submitEditAddProductToBagApi,
  deleteAddProductToBagApi,
};

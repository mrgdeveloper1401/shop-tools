import axios from 'axios';
import getToken from '@/utils/getToken';
import { PaginationWithDataType } from './product';

export interface IBaSalam {
  name: string;
  category_id: number;
  status: number;
  preparation_days: number;
  weight: number;
  package_weight: number;
  primary_price: number;
  stock: number;
  description: string;
  is_wholesale: boolean;
  photos: number[];
  sku: string;
}

const getBaSalamApi = async (pageIndex: number) => {
  try {
    const queryParams = new URLSearchParams({
      page: pageIndex.toString(),
    }).toString();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/third_party_app/read_product/?${queryParams}`,
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

const getBaSalamCategoryApi = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/third_party_app/read_categories/`,
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

const submitBaSalamApi = async (productId: number, FormBody: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/third_party_app/crete_product_ba_salam/${productId}/`,
      FormBody,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch (error: any) {
    return error;
  }
};

const submitEditBaSalamApi = async (productId: number, FormBody: any) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/third_party_app/update_product_ba_salam/${productId}/`,
    JSON.stringify(FormBody),
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};

export {
  getBaSalamCategoryApi,
  getBaSalamApi,
  submitBaSalamApi,
  submitEditBaSalamApi,
};

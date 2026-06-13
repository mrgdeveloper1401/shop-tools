import axios from 'axios';
import getToken from '@/utils/getToken';
import { PaginationWithDataType } from './product';

export interface ICoupon {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  maximum_use: number;
  number_of_uses: number;
  for_first: boolean;
  valid_from: string;
  valid_to: string;
  coupon_type: string;
  amount: string;
  is_active: boolean;
}

const getCouponApi = async (
  pageIndex: number,
): Promise<PaginationWithDataType<ICoupon>> => {
  const query = new URLSearchParams({
    page: pageIndex.toString(),
  }).toString();
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discount/coupon/?${query}`,
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

const submitCouponApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/discount/coupon/`,
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

const submitEditCouponApi = async (
  productId: number,
  categoryId: number,
  FormBody: any,
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/Coupon/${productId}/`,
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

const deleteCouponApi = async (userId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/discount/coupon/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

export { getCouponApi, submitCouponApi, submitEditCouponApi, deleteCouponApi };

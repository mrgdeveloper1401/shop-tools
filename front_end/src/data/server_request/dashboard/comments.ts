import getToken from '@/utils/getToken';
import axios from 'axios';
import { PaginationWithDataType } from './product';

export interface IComments {
  id: number;
  product_id: number;
  user_name: string;
  user_is_staff: boolean;
  path: string;
  numchild: number;
  depth: number;
  created_at: string;
  updated_at: string;
  comment_body: string;
}

const getAllCommentApi = async (
  categoryId: number,
  productId: number,
): Promise<PaginationWithDataType<IComments>> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/comments/`,
  );
  return res.data;
};

const submitCommentApi = async (
  categoryId: number,
  productId: number,
  FormBody: any,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/comments/`,
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

const deleteCommentApi = async (
  id: number,
  categoryId: number,
  productId: number,
) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/comments/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

export { getAllCommentApi, submitCommentApi, deleteCommentApi };

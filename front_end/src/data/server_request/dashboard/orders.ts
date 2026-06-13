import getToken from '@/utils/getToken';
import axios from 'axios';
import { PaginationWithDataType } from './product';

export interface IOrder {
  id: number;
  profile: {
    first_name: 'شاهین';
    last_name: 'زینی';
  };
  address: number;
  shipping: number;
  created_at: string;
  updated_at: string;
  status: string;
  is_complete: false;
  tracking_code: string;
  payment_date: null;
  is_active: true;
}

export interface IResultOrder {
  id: number;
  profile: {
    first_name: string;
    last_name: string;
    user_phone: string;
    created_at: string;
    user_email: string;
  };
  address: {
    city: string;
    state_name: string;
    id: number;
  };
  user_order_count: number;
  is_complete: boolean;
  status: 'pending';
  first_name: string;
  last_name: string;
  phone: string;
}

const getAllOrderApi = async (
  page?: string,
  search?: string,
  filterPaymentStatus?: string,
): Promise<PaginationWithDataType<IOrder>> => {
  try {
    const queryParams = new URLSearchParams({
      ...(page && { page: page }),
      ...(search && { status__iexact: search }),
      ...(filterPaymentStatus && { is_complete: filterPaymentStatus }),
    }).toString();

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/orders/?${queryParams}`,
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

const getAllReasultOrderApi = async (
  page?: string,
  search?: string,
  filterPaymentStatus?: string,
): Promise<PaginationWithDataType<IResultOrder>> => {
  try {
    const queryParams = new URLSearchParams({
      ...(page && { page: page }),
      ...(search && { profile__user__mobile_phone__contains: search }),
      ...(filterPaymentStatus && { status: filterPaymentStatus }),
    }).toString();

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/result_order/?${queryParams}`,
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

export interface IOrderItem {
  id: number;
  order: number;
  product_variant: number;
  variant_name: string;
  product_name: string;
  calc_price_quantity: number;
  created_at: string;
  updated_at: string;
  price: string;
  quantity: number;
  is_active: true;
}

const getOrderItemApi = async (id: number): Promise<IOrderItem[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/orders/${id}/items/`,
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

const submitCreateOrderApi = async (FormBody: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/create_order/`,
      JSON.stringify(FormBody),
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

const submitEditOrderApi = async (OrderId: number, FormBody: any) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_brand/${OrderId}/`,
    FormBody,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
};

const deleteOrderApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_brand/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

const getValidatedCoupunApi = async (coupunId: string) => {
  try {
    const query = new URLSearchParams({
      code: coupunId,
    }).toString();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discount/valid_coupon/?${query}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    return error;
  }
};

export interface IVarifyPayment {
  message: string;
  result: number;
  refNumber: string;
  paidAt: string;
  status: number;
  amount: number;
  orderId: string;
  description: string;
  cardNumber: string;
  multiplexingInfos: any[];
}

const submitVerifyPaymentApi = async (
  trackId: string,
  status: string,
  orderId: string,
): Promise<IVarifyPayment | undefined> => {
  try {
    const queryParams = new URLSearchParams({
      trackId,
      status,
      orderId,
    });
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/verify_payment/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error('Failed to verify payment');
  }
};

// ----Chart----

export interface IChart {
  sale_date: string;
  total_quantity: number;
  total_amount: number;
}

const getChartApi = async (start_date?: string, end_date?: string) => {
  try {
    const query = new URLSearchParams({
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
    }).toString();
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/analytics/daily-sale-summary/?${query}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    return error;
  }
};

export {
  getAllReasultOrderApi,
  submitCreateOrderApi,
  getValidatedCoupunApi,
  getAllOrderApi,
  submitEditOrderApi,
  deleteOrderApi,
  getOrderItemApi,
  submitVerifyPaymentApi,
  getChartApi,
};

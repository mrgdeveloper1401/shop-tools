import axios from 'axios';

import getToken from '@/utils/getToken';

export interface IBanner {
  id: number;
  images: any;
  header_title: string;
  text_color: string;
  background_color: string;
}

const getBannerHeaderAdminApi = async (): Promise<IBanner[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/main_site/`,
  );
  return res.data;
};

const submitBannerHeaderApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/main_site/`,
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

const deleteBannerHeaderApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/main_site/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

// ------Landing Banner---

export interface IBannerCarousel {
  id: number;
  image: number;
  image_url: string;
  name: string;
}

const getBannerLandingAdminApi = async (): Promise<IBannerCarousel[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/carousel/`,
  );
  return res.data;
};

const submitBannerLandingApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/carousel/`,
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

const deleteBannerLandingApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/carousel/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

const getHomeBannerHaderApi = async (): Promise<IBanner[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/main_site/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return [
      {
        id: 0,
        images: '',
        header_title: '',
        text_color: '',
        background_color: '',
      },
    ];
  }
};

const getHomeBannerCarouselApi = async (): Promise<IBannerCarousel[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/carousel/`,
      {
        next: { revalidate: 180 },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
};

export {
  getBannerHeaderAdminApi,
  submitBannerHeaderApi,
  deleteBannerHeaderApi,
  getBannerLandingAdminApi,
  submitBannerLandingApi,
  deleteBannerLandingApi,
  getHomeBannerHaderApi,
  getHomeBannerCarouselApi,
};

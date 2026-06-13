import axios from 'axios';
import getToken from '@/utils/getToken';

export interface ISiteMap {
  slug_text: string;
  last_modified: string;
  changefreq: string;
  priority: string;
}
const getSiteMapApi = async (): Promise<ISiteMap[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/main_site/`,
    );

    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch images');
  }
};

const getSiteMapXmlApi = async (): Promise<ISiteMap[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api_core/site_map/`,
      {
        next: { revalidate: 360 },
      },
    );
    return await res.json();
  } catch (error) {
    return [];
  }
};

const submitSiteMapApi = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/main_site/`,
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

const deleteSiteMapApi = async (imageId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/main_site/${imageId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

export { getSiteMapApi, getSiteMapXmlApi, submitSiteMapApi, deleteSiteMapApi };

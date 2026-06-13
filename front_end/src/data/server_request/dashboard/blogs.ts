import axios from 'axios';
import getToken from '@/utils/getToken';
import { PaginationWithDataType } from './product';

//blog category

export interface IBlogCategory {
  id: number;
  path: string;
  depth: number;
  numchild: number;
  created_at: string;
  updated_at: string;
  category_name: string;
}

const getBlogCategoryApi = async (): Promise<IBlogCategory[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return [
      {
        id: 0,
        path: '',
        depth: 0,
        numchild: 0,
        created_at: '',
        updated_at: '',
        category_name: '',
      },
    ];
  }
};

const getBlogCategoryAdminApi = async (): Promise<IBlogCategory[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/`,
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return error.response.data.message[0];
    } else {
      throw new Error('خطایی رخ داده است.');
    }
  }
};

const submitBlogCategoryApi = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/`,
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

const submitEditBlogCategoryApi = async (id: number, formBody: any) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/${id}/`,
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

const deleteBlogCategoryApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

//Blog Post

export interface IBlogPosts {
  id: number;
  post_title: string;
  post_introduction: string;
  post_slug: string;
  post_cover_image_url: { image: string; id: number };
  author: { full_name: string; id: number }[];
  category: { category_name: string };
  read_time: number;
  tags: { id: number; tag_name: string }[];
  created_at: string;
}
export interface IBlogPostsArticle {
  id: number;
  post_title: string;
  post_introduction: string;
  post_slug: string;
  post_cover_image: { image: string; id: number };
  author: { full_name: string; id: number }[];
  category: { category_name: string };
  read_time: number;
  tags: { id: number; tag_name: string }[];
  created_at: string;
}

export interface IBlogPostOne {
  id: number;
  category: {
    id: number;
    category_name: string;
  };
  author: {
    id: number;
    full_name: string;
  }[];
  tags: {
    id: number;
    tag_name: string;
  }[];
  post_cover_image: number;
  created_at: string;
  updated_at: string;
  post_title: string;
  post_slug: string;
  post_body: string;
  read_time: number;
  likes: number;
  description_slug: string;
  post_introduction: string;
  post_cover_image_url: {
    id: number;
    image: string;
  };
}

const getBlogPostApi = async (
  categoryId: number,
  pageIndex?: number,
): Promise<PaginationWithDataType<IBlogPostsArticle>> => {
  try {
    const queryParams = new URLSearchParams();
    if (pageIndex) queryParams.append('page', pageIndex.toString());

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/${categoryId}/post_blog/?${queryParams}`,
    );

    return res.data;
  } catch (error) {
    return { count: 0, next: 0, previous: 0, results: [] };
  }
};

export interface IPostArticle {
  id: number;
  tags: { id: number; tag_name: string }[];
  category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  post_introduction: string;
  post_title: string;
  post_slug: string;
  post_body: string;
  read_time: number;
  post_cover_image: string;
  likes: number;
  is_active: boolean;
  description_slug: string;
  author: { id: number; full_name: string }[];
}

const getBlogPostArticleApi = async (slug: string): Promise<IPostArticle> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/seo_post_detail_blog/${slug}/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return {
      id: 0,
      tags: [],
      category_id: 0,
      category_name: '',
      created_at: '',
      updated_at: '',
      post_introduction: '',
      post_title: '',
      post_slug: '',
      post_body: '',
      read_time: 0,
      post_cover_image: '',
      likes: 0,
      is_active: false,
      description_slug: '',
      author: [],
    };
  }
};

const getOneBlogPostApi = async (
  postSlug: string,
  categoryId: number,
): Promise<IBlogPostOne> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/${categoryId}/post_blog/${postSlug}/`,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return error.response.data.message[0];
    } else {
      throw new Error('خطایی رخ داده است.');
    }
  }
};

const submitBlogPostApi = async (categoryId: number, formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/${categoryId}/post_blog/`,
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

const submitEditBlogPostApi = async (
  postSlug: string,
  categoryId: number,
  formBody: any,
) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/${categoryId}/post_blog/${postSlug}/`,
      formBody,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
          'Content-Type': 'multipart/form-data',
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

const deleteBlogPostApi = async (post_slug: string, categoryId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/category_blog/${categoryId}/post_blog/${post_slug}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

//Blog Tags
export interface IBlogTags {
  id: number;
  created_at: string;
  updated_at: string;
  tag_name: string;
}
const getBlogTagApi = async (): Promise<IBlogTags[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/tag_blog_without_pagination/`,
    );

    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch BlogPost');
  }
};

const submitBlogTagApi = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/tag_blog/`,
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

const deleteBlogTagApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/tag_blog/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

//Blog Author Info

export interface IAllUsers {
  get_full_name: string;
  mobile_phone: string;
  id: number;
}
const getAllUsersApi = async (): Promise<IAllUsers[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/admin_user_list/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch BlogPost');
  }
};

export interface ILatestBlogApi {
  id: number;
  category: {
    category_name: string;
    id: number;
  };
  post_title: string;
  post_introduction: string;
  author: {
    get_full_name: string;
  }[];
  post_cover_image: {
    id: number;
    image: string;
  };
  post_slug: string;
  created_at: string;
}

const getLatestBlogApi = async (): Promise<ILatestBlogApi[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/latest_ten_post_blog/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return [
      {
        id: 0,
        category: {
          category_name: '',
          id: 0,
        },
        post_title: '',
        post_introduction: '',
        author: [
          {
            get_full_name: '',
          },
        ],
        post_cover_image: {
          id: 0,
          image: '',
        },
        post_slug: '',
        created_at: '',
      },
    ];
  }
};

//ImageCatalog

export interface IImageCatalog {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

const getImageCatalogApi = async (
  pageIndex: any,
): Promise<PaginationWithDataType<IImageCatalog>> => {
  const queryParams = new URLSearchParams({
    page: pageIndex.toLocaleString(),
  }).toString();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/admin_images/?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const submitImageCatalogApi = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/admin_images/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
          'Content-Type': 'multipart/form-data',
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

const deleteImageCatalogApi = async (imageId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/admin_images/${imageId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

export {
  getBlogCategoryApi,
  getBlogCategoryAdminApi,
  getBlogPostApi,
  submitEditBlogPostApi,
  getOneBlogPostApi,
  submitBlogCategoryApi,
  submitEditBlogCategoryApi,
  deleteBlogCategoryApi,
  getBlogPostArticleApi,
  deleteBlogPostApi,
  submitBlogPostApi,
  getBlogTagApi,
  submitBlogTagApi,
  deleteBlogTagApi,
  getAllUsersApi,
  getLatestBlogApi,
  getImageCatalogApi,
  submitImageCatalogApi,
  deleteImageCatalogApi,
};

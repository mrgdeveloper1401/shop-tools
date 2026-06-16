import getToken from '@/utils/getToken';
import axios from 'axios';

export type PaginationType = {
  count: number;
  next: number;
  previous: number;
};

export type PaginationWithDataType<T> = {
  results: T[];
} & PaginationType;

// ----------Category----------

export interface ICategory {
  get_category_image_url: string;
  category_name: string;
  id: number;
}

const getCategoryApi = async (
  pageIndex: any,
  search?: string,
): Promise<PaginationWithDataType<ICategory>> => {
  const queryParams = new URLSearchParams({
    page: pageIndex.toLocaleString(),
    ...(search && { category_name__contains: search }),
  }).toString();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const getAllCategoryApi = async (): Promise<ICategory[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/list_index_category_name/`,
  );
  return res.data;
};

const getHomeCategoryApi = async (): Promise<ICategory[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/list_index_category_name/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return [];
  }
};

const submitCategoryApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/`,
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

const submitEditCategoryApi = async (CategoryId: number, FormBody: any) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${CategoryId}/`,
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

const deleteCategoryApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

// -----------Tags----------

export interface ITags {
  id: number;
  tag_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const getTagsApi = async (
  pageIndex: any,
  search?: string,
): Promise<PaginationWithDataType<ITags>> => {
  const queryParams = new URLSearchParams({
    page: pageIndex.toLocaleString(),
    ...(search && { tag_name__contains: search }),
  }).toString();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_tag/?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const getAllTagsApi = async (): Promise<ITags[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/list_index_tag_name/`,
  );
  return res.data;
};

const submitTagApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_tag/`,
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

const submitEditTagApi = async (tagId: number, FormBody: any) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_tag/${tagId}/`,
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

const deleteTagApi = async (tagId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_tag/${tagId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

const submitAddTagToProductApi = async (productId: number, FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}/tags/`,
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

// -----------Products----------

export interface IProducts {
  id: number;
  sku: string;
  tags: {
    tag_name: string;
    id: number;
  }[];
  product_brand: {
    brand_name: string;
    id: number;
  };
  category_id: number;
  product_product_image: {
    image: {
      get_image_url: string;
    };
    order: number;
    alt_text_image: string;
  }[];
  product_name: string;
  product_slug: string;
  description: string;
  description_slug: string;
  is_active: boolean;
  social_links: any;
  variants: {
    price: string;
    variant_id: number;
    product_variant_discounts: { amount: any }[];
    is_available: boolean;
    stock_number: number;
    name: string;
  }[];
}

export interface IProductDetail {
  in_person_purchase: boolean;
  product_id_ba_salam: number | null;
  base_price: string | null;
  product_name: string;
  description: string;
  product_brand: {
    brand_name: string;
    id: number;
  };
  tags: {
    tag_name: string;
    id: number;
  }[];
  product_product_image: {
    image: {
      get_image_url: string;
      image_id_ba_salam: number;
    };
    order: number;
    alt_text_image: string;
  }[];
  attributes: {
    attribute_name: string;
    value: string;
  }[];
  variants: {
    price: string;
    variant_id: number;
    product_variant_discounts: {
      amount: string;
      discount_type: string;
    }[];
    is_available: boolean;
    stock_number: number;
    name: string;
  }[];
  sku: number;
  category: {
    id: number;
    category_name: string;
  };
}

const getProductsApi = async (
  pageIndex: any,
  filter?: any,
  search_product?: string,
  search_tags?: string,
  ordering?: string,
  has_discount?: boolean,
  brandId?: number,
): Promise<PaginationWithDataType<IProducts>> => {
  const queryParams = new URLSearchParams({
    page: pageIndex.toLocaleString(),
    ...(filter && { filter: filter }),
    ...(search_product && { name__icontains: search_product }),
    ...(search_tags && { tags__tag_name__contains: search_tags }),
    ...(ordering && { ordering: ordering }),
    ...(has_discount && { has_discount: has_discount }),
    ...(brandId && { brand_id: brandId }),
  }).toString();

  try {
    const res = await axios.get(
      `https://api.gs-tools.ir/v2/product/product_list?${queryParams}`,
    );
    return res.data;
  } catch (error) {
    // console.log(error);
    return {
      count: 0,
      next: 0,
      previous: 0,
      results: [],
    };
  }
};

const getProductShopApi = async (
  categoryId: number,
  urlPageIndex: number,
): Promise<PaginationWithDataType<IProducts>> => {
  const queryParams = new URLSearchParams({
    page: urlPageIndex.toString(),
    category_id: categoryId.toString()
  }).toString();
  const res = await axios.get(
      `https://api.gs-tools.ir/v2/product/product_list?${queryParams}`,
  );
  return res.data;
};

const getHomeProductsApi = async (
  pageIndex: any,
  filter?: any,
  search_product?: string,
  search_tags?: string,
  ordering?: string,
  has_discount?: boolean,
): Promise<PaginationWithDataType<IProducts>> => {
  try {
    const queryParams = new URLSearchParams({
      page: pageIndex.toLocaleString(),
      ...(filter && { filter: filter }),
      ...(search_product && { product_name__contains: search_product }),
      ...(search_tags && { tags__tag_name__contains: search_tags }),
      ...(ordering && { ordering: ordering }),
      ...(has_discount && { has_discount: has_discount }),
    }).toString();
    const res = await fetch(
      `https://api.gs-tools.ir/v2/product/product_list?${queryParams}`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return {
      count: 0,
      next: 0,
      previous: 0,
      results: [
        {
          id: 0,
          sku: '',
          tags: [
            {
              tag_name: '',
              id: 0,
            },
          ],
          product_brand: {
            brand_name: '',
            id: 0,
          },
          category_id: 0,
          product_product_image: [
            {
              image: {
                get_image_url: '',
              },
              order: 0,
              alt_text_image: '',
            },
          ],
          product_name: '',
          product_slug: '',
          description: '',
          description_slug: '',
          is_active: true,
          social_links: '',
          variants: [
            {
              price: '',
              variant_id: 0,
              product_variant_discounts: [{ amount: 0 }],
              is_available: true,
              stock_number: 0,
              name: '',
            },
          ],
        },
      ],
    };
  }
};

const getRelatedProductApi = async (
  categoryId: number,
): Promise<PaginationWithDataType<IProducts>> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/`,
  );
  return res.data;
};

const getOneProductApi = async (
  productId: number,
  categoryId: number,
): Promise<IProductDetail> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/`,
  );
  return res.data;
};

const getOneProductAdminApi = async (
  productId: number,
  categoryId: number,
): Promise<IProductDetail> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
};

const submitProductsApi = async (categoryId: number, FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/`,
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

const submitEditProductsApi = async (
  productId: number,
  categoryId: number,
  FormBody: any,
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/`,
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

const deleteProductsApi = async (productId: number, categoryId: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// ----------- Images----------

export interface IImages {
  id: number;
  image: number;
  order: number;
  is_active: boolean;
  alt_text_image: string;
}

const getImagesApi = async (
  categoryId: number,
  productId: number,
): Promise<IImages[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_images/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const submitImageApi = async (
  categoryId: number,
  productId: number,
  formBody: any,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_images/`,
    formBody,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};

const submitImageFileApi = async (formBody: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/admin_images/`,
      formBody,
      {
        headers: {
          Authorization: `Bearer ${getToken()?.token.access}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    return error;
  }
};

const deleteImageApi = async (
  imageId: number,
  productId: number,
  categoryId: number,
) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_images/${imageId}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// ----------Discount----------

export interface IDiscount {
  id: number;
  product_variant: number;
  is_valid_discount: boolean;
  created_at: string;
  updated_at: string;
  discount_type: string;
  amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const getDiscountsApi = async (
  variantId: number,
  productId: number,
  categoryId: number,
): Promise<PaginationWithDataType<IDiscount>> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_variant/${variantId}/discount/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const submitDiscountApi = async (
  variantId: number,
  productId: number,
  categoryId: number,
  FormBody: any,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_variant/${variantId}/discount/`,
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

const deleteDiscountApi = async (
  id: number,
  variantId: number,
  productId: number,
  categoryId: number,
) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_variant/${variantId}/discount/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// ----------AttributeKey----------

export interface IAttributeKey {}

const getAttributeKeysApi = async (): Promise<IAttributeKey[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/attribute/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const submitAttributeKeyApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/attribute/`,
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

const deleteAttributeKeyApi = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/attribute/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

// -----------------Specification-----------------

export interface ISpecification {}

const getSpecificationApi = async (
  category: number,
  product: number,
): Promise<ISpecification[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${category}/products/${product}/product_attribute_values/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const submitSpecificationApi = async (
  category: number,
  product: number,
  FormBody: any,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${category}/products/${product}/product_attribute_values/`,
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

const deleteSpecificationApi = async (
  id: number,
  product: number,
  category: number,
) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${category}/products/${product}/product_attribute_values/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// ----------Variant----------

export interface IVariant {
  id: number;
  product: number;
  price: string;
  stock_number: number;
  is_active: boolean;
}

const getVariantsApi = async (
  categoryId: number,
  productId: number,
): Promise<IVariant[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_variant/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const submitVariantApi = async (
  categoryId: number,
  productId: number,
  FormBody: any,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_variant/`,
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

const deleteVariantApi = async (
  id: number,
  categoryId: number,
  productId: number,
) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/${productId}/product_variant/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res;
};

// ----------Brands----------

export interface IBrands {
  brand_name: string;
  id: number;
  brand_image_url: string;
}

export interface IBrandsHome {
  brand_name: string;
  brand_image_url: string;
  id: number;
}

const getHomeLandingBrandsApi = async (): Promise<IBrandsHome[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/list_index_brand_name/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return [{ brand_name: '', brand_image_url: '', id: 0 }];
  }
};

const getProductFromCategoryApi = async (
  categoryId: number,
): Promise<PaginationWithDataType<IProductHome>> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_category/${categoryId}/products/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return {
      count: 0,
      next: 0,
      previous: 0,
      results: [],
    };
  }
};

const getBrandsApi = async (
  pageIndex: any,
  search?: string,
): Promise<PaginationWithDataType<IBrands>> => {
  const queryParams = new URLSearchParams({
    page: pageIndex.toLocaleString(),
    ...(search && { brand_name__contains: search }),
  }).toString();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_brand/?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
      },
    },
  );
  return res.data;
};

const submitEditBrandsApi = async (id: number, FormData: any) => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_brand/${id}/`,
    FormData,
    {
      headers: {
        Authorization: `Bearer ${getToken()?.token.access}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
};

const getAllBrandsApi = async (): Promise<IBrands[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/list_index_brand_name/`,
  );
  return res.data;
};

const getHomeBrandsApi = async (): Promise<IBrands[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/list_index_brand_name/`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return [];
  }
};

const submitBrandsApi = async (FormBody: any) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/product_brand/`,
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

const deleteBrandsApi = async (id: number) => {
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

// -----home product----

export interface IProductHome {
  id: number;
  in_person_purchase: boolean;
  category_id: number;
  product_name: string;
  product_product_image: {
    image: {
      get_image_url: string;
    };
    order: number;
    alt_text_image: string;
  }[];

  variants: {
    price: string;
    variant_id: number;
    product_variant_discounts: { amount: any }[];
    is_available: boolean;
    stock_number: number;
    name: string;
  }[];
  product_slug: string;
  description_slug: string;
  created_at: string;
  updated_at: string;
}
const getHomeProductApi = async (): Promise<
  PaginationWithDataType<IProductHome>
> => {
  try {
    const res = await fetch(
      `https://api.gs-tools.ir/v2/product/product_list`,
      {
        next: { revalidate: 180 },
      },
    );
    return await res.json();
  } catch (error) {
    return {
      count: 0,
      next: 0,
      previous: 0,
      results: [],
    };
  }
};

export {
  getHomeProductApi,
  getCategoryApi,
  submitCategoryApi,
  submitEditCategoryApi,
  deleteCategoryApi,
  getTagsApi,
  submitTagApi,
  submitEditTagApi,
  deleteTagApi,
  submitAddTagToProductApi,
  getProductsApi,
  getProductShopApi,
  getHomeProductsApi,
  getOneProductApi,
  getOneProductAdminApi,
  getRelatedProductApi,
  submitProductsApi,
  submitEditProductsApi,
  deleteProductsApi,
  getImagesApi,
  submitImageApi,
  submitImageFileApi,
  deleteImageApi,
  getDiscountsApi,
  submitDiscountApi,
  deleteDiscountApi,
  getAttributeKeysApi,
  submitAttributeKeyApi,
  deleteAttributeKeyApi,
  getSpecificationApi,
  submitSpecificationApi,
  deleteSpecificationApi,
  getVariantsApi,
  submitVariantApi,
  deleteVariantApi,
  getBrandsApi,
  getHomeLandingBrandsApi,
  submitBrandsApi,
  submitEditBrandsApi,
  deleteBrandsApi,
  getAllBrandsApi,
  getAllCategoryApi,
  getAllTagsApi,
  getHomeCategoryApi,
  getHomeBrandsApi,
  getProductFromCategoryApi,
};

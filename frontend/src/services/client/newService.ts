import apiClient from './apiClient';

export const getAllNews = async (
  page: number = 1,
  limit: number = 10,
  keyword: string = ''
): Promise<any> => {
  return apiClient.get(`/news`, {
    params: {
      keyword,
      page,
      limit,
    },
  });
};

export const getNewsById = async (id: string | number): Promise<any> => {
  return apiClient.get(`/news/${id}`);
};

export const createNews = async (
  title: string,
  content: string,
  imageFile: File | null
): Promise<any> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return apiClient.post(`/news`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateNews = async (
  id: string | number,
  title: string,
  content: string,
  imageFile: File | null
): Promise<any> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return apiClient.put(`/news/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteNews = async (id: string | number): Promise<any> => {
  return apiClient.delete(`/news/${id}`);
};
import axios from 'axios';
import { API_CONFIG } from '../config';
import apiClient from './apiClient';

export const getAddressBooksByUserId = async (userId: string): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/user/${userId}`);
};

export const getAddressBooksForCurrentUser = async (): Promise<any> => {
  return apiClient.get(`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/me`);
};

export const createAddressBook = async (
  userId: string,
  recipientName: string,
  phoneNumber: string,
  address: string,
  ward: string,
  district: string,
  city: string,
  email: string
): Promise<any> => {
  const addressData = {
    recipientName,
    phoneNumber,
    address,
    ward,
    district,
    city,
    email,
  };

  return apiClient.post(`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/user/${userId}`, addressData);
};

export const updateAddressBook = async (
  addressBookId: string,
  recipientName: string,
  phoneNumber: string,
  address: string,
  ward: string,
  district: string,
  city: string,
  email: string
): Promise<any> => {
  const addressData = {
    recipientName,
    phoneNumber,
    address,
    ward,
    district,
    city,
    email,
  };

  return apiClient.put(`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/${addressBookId}`, addressData);
};

export const deleteAddressBook = async (addressBookId: string): Promise<any> => {
  return apiClient.delete(`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/${addressBookId}`);
};

const PROVINCE_API_URL = 'https://provinces.open-api.vn/api/p/';

export const fetchProvinces = async () => {
  const response = await axios.get(PROVINCE_API_URL);
  return response.data;
};

export const fetchDistrictsByProvince = async (provinceCode: string) => {
  const response = await axios.get(`${PROVINCE_API_URL}?p=${provinceCode}`);
  return response.data.districts;
};

export const fetchWardsByDistrict = async (districtCode: string) => {
  const response = await axios.get(`${PROVINCE_API_URL}?d=${districtCode}`);
  return response.data.wards;
};

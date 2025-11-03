import axios from "axios";
import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm lấy tất cả AddressBook theo User ID
export const getAddressBooksByUserId = async (userId: any): Promise<any> => {
	return apiClient.get(`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/user/${userId}`);
};

// Hàm tạo mới AddressBook
export const createAddressBook = async (
	userId: any,
	recipientName: string,
	phoneNumber: string,
	address: string,
	ward: string,
	district: string,
	city: string,
	email: string // Thêm trường email
): Promise<any> => {
	const addressData = {
		recipientName,
		phoneNumber,
		address,
		ward,
		district,
		city,
		email, // Thêm email vào dữ liệu tạo mới
	};

	return apiClient.post(
		`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/user/${userId}`,
		addressData
	);
};

// Hàm cập nhật AddressBook theo ID
export const updateAddressBook = async (
	addressBookId: any,
	recipientName: string,
	phoneNumber: string,
	address: string,
	ward: string,
	district: string,
	city: string,
	email: string // Thêm trường email
): Promise<any> => {
	const addressData = {
		recipientName,
		phoneNumber,
		address,
		ward,
		district,
		city,
		email, // Thêm email vào dữ liệu cập nhật
	};

	return apiClient.put(
		`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/${addressBookId}`,
		addressData
	);
};

// Hàm xóa AddressBook theo ID
export const deleteAddressBook = async (addressBookId: any): Promise<any> => {
	return apiClient.delete(
		`${API_CONFIG.ENDPOINTS.ADDRESS_BOOK}/${addressBookId}`
	);
};

// API URL cho Tỉnh, Quận, Phường
const PROVINCE_API_URL = "https://provinces.open-api.vn/api/p/";

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

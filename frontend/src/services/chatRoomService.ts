import { API_CONFIG } from "./config";
import apiClient from "./apiClient";

// Hàm lấy customerId từ localStorage (giả định user được lưu trong localStorage)
const getCustomerId = (): number | null => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	return user?.userId || null;
};

// Hàm tạo phòng chat cho khách hàng với customerId
export const createChatRoom = async (): Promise<any> => {
	const customerId = getCustomerId(); // Lấy customerId từ localStorage

	if (!customerId) {
		throw new Error("CustomerId not found in localStorage");
	}

	return apiClient.post(
		`/chatrooms`,
		null, // Không có body nên gửi null
		{
			params: { customerId }, // Truyền customerId qua query params
		}
	);
};

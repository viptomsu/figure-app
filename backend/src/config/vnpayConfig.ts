import crypto from "crypto";
import { Request } from "express";

export const vnp_PayUrl: string = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
export const vnp_Returnurl: string = "http://localhost:3000/checkoutvnpay";
export const vnp_TmnCode: string = "FYJL2QHA";
export const vnp_HashSecret: string = "JOWHMKFHFDUHLQQAVQDIJVDNNTDPJSBE";
export const vnp_apiUrl: string =
  "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

export const hashAllFields = (fields: Record<string, string>): string => {
  const sortedFields: string[] = Object.keys(fields).sort();
  const queryStr: string = sortedFields.map((key) => `${key}=${fields[key]}`).join("&");

  return hmacSHA512(vnp_HashSecret, queryStr);
};

export const hmacSHA512 = (key: string, data: string): string => {
  return crypto
    .createHmac("sha512", Buffer.from(key, "utf-8"))
    .update(data, "utf-8")
    .digest("hex");
};

export const getIpAddress = (req: Request): string | string[] | undefined => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  return ipAddress;
};

export const getRandomNumber = (len: number): string => {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
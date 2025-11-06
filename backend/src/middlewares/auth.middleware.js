import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkAuth = (req, res, next) => {
  try {
    // Primary token source - cookies
    let token = req.cookies.auth_token || req.cookies['auth_token'];

    // Fallback token source - Authorization header
    if (!token) {
      const bearerAuth = req.headers.authorization;
      if (bearerAuth) {
        token = bearerAuth.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(401)
        .send(new ApiResponse(401, null, "Authentication required"));
    }

    const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userData) {
      return res
        .status(401)
        .send(new ApiResponse(401, null, "Invalid or expired token"));
    }

    req.user = userData;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .send(new ApiResponse(401, null, "Invalid or expired token"));
  }
};
export { checkAuth };

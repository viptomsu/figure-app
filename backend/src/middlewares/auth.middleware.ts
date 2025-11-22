import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import { UserRole } from "@prisma/client";

interface AuthJwtPayload {
	id: string;
	role: UserRole;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthJwtPayload;
		}
	}
}

const checkAuth = (
	req: Request,
	res: Response,
	next: NextFunction
): void | Response => {
	try {
		// Check if ACCESS_TOKEN_SECRET is configured
		if (!process.env.ACCESS_TOKEN_SECRET) {
			return res
				.status(500)
				.send(new ApiResponse(500, null, "Server configuration error"));
		}

		// Primary token source - cookies
		let token: string | undefined =
			req.cookies.auth_token || req.cookies["auth_token"];

		// Fallback token source - Authorization header
		if (!token) {
			const bearerAuth: string | undefined = req.headers.authorization;
			if (bearerAuth) {
				token = bearerAuth.split(" ")[1];
			}
		}

		if (!token) {
			return res
				.status(401)
				.send(new ApiResponse(401, null, "Authentication required"));
		}

		const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

		if (!payload) {
			return res
				.status(401)
				.send(new ApiResponse(401, null, "Invalid or expired token"));
		}

		// Validate JWT payload shape
		if (
			typeof payload !== 'object' ||
			!payload ||
			typeof payload.id !== 'string' ||
			!Object.values(UserRole).includes(payload.role as UserRole)
		) {
			return res
				.status(401)
				.send(new ApiResponse(401, null, "Invalid token payload"));
		}

		req.user = { id: payload.id as string, role: payload.role as UserRole };

		next();
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.send(new ApiResponse(401, null, "Invalid or expired token"));
	}
};

export { checkAuth };

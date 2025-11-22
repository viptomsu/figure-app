import { Request, Response } from "express";
import nodemailer, { Transporter } from "nodemailer";
import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma.client";

type PopulatedOrder = Prisma.OrderGetPayload<{
	include: {
		user: {
			select: {
				fullName: true;
				email: true;
				phoneNumber: true;
			};
		};
		addressBook: {
			select: {
				recipientName: true;
				address: true;
				ward: true;
				district: true;
				city: true;
				phoneNumber: true;
				email: true;
			};
		};
		orderDetails: {
			include: {
				product: {
					select: {
						productName: true;
						images: {
							where: {
								isDefault: true;
							};
							select: {
								imageUrl: true;
							};
						};
					};
				};
				productVariation: {
					select: {
						attributeValue: true;
						attributeName: true;
					};
				};
			};
		};
	};
}>;

// Hàm tìm kiếm Order theo mã đơn hàng (orderCode)
const findOrderByCode = async (orderCode: string): Promise<PopulatedOrder> => {
	const order = await prisma.order.findUnique({
		where: { code: orderCode },
		include: {
			user: {
				select: {
					fullName: true,
					email: true,
					phoneNumber: true,
				},
			},
			addressBook: {
				select: {
					recipientName: true,
					address: true,
					ward: true,
					district: true,
					city: true,
					phoneNumber: true,
					email: true,
				},
			},
			orderDetails: {
				include: {
					product: {
						select: {
							productName: true,
							images: {
								where: {
									isDefault: true,
								},
								select: {
									imageUrl: true,
								},
							},
						},
					},
					productVariation: {
						select: {
							attributeValue: true,
							attributeName: true,
						},
					},
				},
			},
		},
	});

	if (!order) {
		throw new Error(`Order not found with code: ${orderCode}`);
	}
	return order;
};
// Hàm gửi email xác nhận đơn hàng
export const sendOrderConfirmationEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { orderCode } = req.query;

	try {
		const order: PopulatedOrder = await findOrderByCode(orderCode as string);
		console.log(order);
		// Tính toán giảm giá và tổng giá trị
		const discountPercentage: number = order.discount.toNumber() / 100;
		const subtotal: number =
			order.totalPrice.toNumber() / (1 - discountPercentage);
		const discountAmount: number = subtotal * discountPercentage;

		// Tạo nội dung HTML của email
		const htmlContent: string = `
      <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2;">
        <h2 style="color: #ff9900; font-weight: bold;">Xác nhận đơn hàng</h2>
        <p>Xin chào ${order.addressBook.recipientName},</p>
        <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>

        <h3 style="font-weight: bold; border-bottom: 2px solid #e2e2e2; padding-bottom: 10px;">Sản phẩm đã đặt</h3>
        ${order.orderDetails
					.map((item) => {
						const defaultImageUrl: string =
							item.product.images[0]?.imageUrl || "URL của ảnh mặc định";
						const variationInfo: string = item.productVariation
							? `<p>${item.productVariation.attributeName}: ${item.productVariation.attributeValue}</p>`
							: "";
						return `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e2e2;">
              <div><img src="${defaultImageUrl}" alt="${
							item.product.productName
						}" style="width: 50px; height: 50px; object-fit: cover;"></div>
              <div style="flex: 1; padding-left: 4px;">
                <p style="font-weight: bold;">${item.product.productName}</p>
                ${variationInfo}
                <p>Số lượng: ${item.quantity}</p>
              </div>
              <div style="text-align: right; margin-left: 10px"><p>${item.price
								.toNumber()
								.toLocaleString()}₫</p></div>
            </div>`;
					})
					.join("")}

        <div style="border-top: 2px solid #e2e2e2; padding: 20px 0;">
          <p><strong>Tạm tính:</strong> ${subtotal.toLocaleString()}₫</p>
          <p><strong>Giảm giá:</strong> -${discountAmount.toLocaleString()}₫</p>
          <p><strong>Tổng cộng:</strong> <span style="color: #ff9900;">${order.totalPrice
						.toNumber()
						.toLocaleString()}₫</span></p>
        </div>

        <h3 style="font-weight: bold; margin-top: 20px;">Thông tin giao hàng</h3>
        <p>${order.addressBook.recipientName}</p>
        <p>${order.addressBook.address}, ${order.addressBook.ward}, ${
			order.addressBook.district
		}, ${order.addressBook.city}</p>
        <p>${order.addressBook.phoneNumber}</p>

        <h3 style="font-weight: bold; margin-top: 20px;">Thanh toán</h3>
        <p>${order.paymentMethod} - ${order.status}</p>

        <p style="margin-top: 30px; font-size: 12px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với <a href="#" style="color: #ff9900;">Dịch vụ khách hàng</a>.</p>
      </div>`;

		// Cấu hình Nodemailer
		const transporter: Transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// Cài đặt email
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: order.addressBook.email,
			subject: `Xác nhận đơn hàng - ${order.code}`,
			html: htmlContent,
		};

		// Gửi email
		await transporter.sendMail(mailOptions);

		res
			.status(200)
			.json({ message: "Email xác nhận đơn hàng đã được gửi thành công!" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Lỗi khi gửi email xác nhận đơn hàng" });
	}
};

export const sendResetPasswordEmail = async (
	email: string,
	resetToken: string
): Promise<void> => {
	try {
		const resetUrl: string = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

		const htmlContent: string = `
      <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2;">
        <h2 style="color: #ff9900; font-weight: bold;">Yêu cầu đặt lại mật khẩu</h2>
        <p>Xin chào,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #ff9900; color: white; padding: 10px 20px; text-decoration: none; margin-top: 10px; border-radius: 4px;">Đặt lại mật khẩu</a>
        <p style="margin-top: 20px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p style="margin-top: 30px; font-size: 12px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với <a href="#" style="color: #ff9900;">Dịch vụ khách hàng</a>.</p>
      </div>
    `;

		// Cấu hình Nodemailer
		const transporter: Transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// Cài đặt email
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Đặt lại mật khẩu của bạn",
			html: htmlContent,
		};

		// Gửi email
		await transporter.sendMail(mailOptions);
		console.log("Email đặt lại mật khẩu đã được gửi thành công!");
	} catch (error) {
		console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
		throw new Error("Lỗi khi gửi email đặt lại mật khẩu");
	}
};

import { PrismaClient, UserRole } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { uploadImageToCloudinary } from "../src/services/cloudinary.service";

dotenv.config();

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

async function fetchAndUploadImage(
	url: string,
	folder: string,
	fileName: string
): Promise<string> {
	// Check if already a cloudinary url to avoid re-uploading
	if (url.includes("cloudinary")) return url;

	try {
		console.log(`Fetching image from ${url}...`);
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Referer: "https://www.google.com/",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch image: ${response.status} ${response.statusText}`
			);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const contentType = response.headers.get("content-type") || "image/jpeg";

		console.log(`Uploading to Cloudinary folder ${folder}...`);
		const secureUrl = await uploadImageToCloudinary(
			buffer,
			fileName,
			false, // compress
			contentType,
			folder
		);

		return secureUrl;
	} catch (error) {
		console.error(`Failed to process image from ${url}:`, error);
		return url; // Fallback to original URL
	}
}

async function main() {
	console.log("Start seeding...");

	// 1. Create Admin User
	const adminPassword = await bcrypt.hash("password123", 10);
	await prisma.user.upsert({
		where: { username: "admin" },
		update: {},
		create: {
			username: "admin",
			email: "admin@figure.com",
			password: adminPassword,
			fullName: "Admin User",
			role: UserRole.ADMIN,
			active: true,
		},
	});
	console.log("Admin user created/verified.");

	// 2. Create Categories
	const createCategory = async (
		name: string,
		desc: string,
		imgUrl: string,
		imgName: string
	) => {
		const uploadedImg = await fetchAndUploadImage(
			imgUrl,
			"figure/categories",
			imgName
		);

		const existing = await prisma.category.findFirst({
			where: { categoryName: name },
		});
		if (existing) {
			await prisma.category.update({
				where: { id: existing.id },
				data: { description: desc, image: uploadedImg },
			});
			console.log(`Updated category: ${name}`);
			return existing;
		} else {
			const newCat = await prisma.category.create({
				data: { categoryName: name, description: desc, image: uploadedImg },
			});
			console.log(`Created category: ${name}`);
			return newCat;
		}
	};

	const gundamCat = await createCategory(
		"Mô hình Gundam",
		"Các dòng mô hình lắp ráp Gundam chính hãng từ Bandai",
		"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Gundam_RX-78-2.jpg/800px-Gundam_RX-78-2.jpg",
		"gundam-cat"
	);

	const toolsCat = await createCategory(
		"Dụng cụ & Sơn",
		"Kìm, dao, nhám, sơn và các dụng cụ hỗ trợ lắp ráp",
		"https://m.media-amazon.com/images/I/61w-GjK1imL._AC_SL1500_.jpg",
		"tools-cat"
	);

	// 3. Create Brands
	const createBrand = async (
		name: string,
		desc: string,
		imgUrl: string,
		imgName: string
	) => {
		const uploadedImg = await fetchAndUploadImage(
			imgUrl,
			"figure/brands",
			imgName
		);

		const existing = await prisma.brand.findFirst({
			where: { brandName: name },
		});
		if (existing) {
			await prisma.brand.update({
				where: { id: existing.id },
				data: { description: desc, image: uploadedImg },
			});
			console.log(`Updated brand: ${name}`);
			return existing;
		} else {
			const newBrand = await prisma.brand.create({
				data: { brandName: name, description: desc, image: uploadedImg },
			});
			console.log(`Created brand: ${name}`);
			return newBrand;
		}
	};

	const bandaiBrand = await createBrand(
		"Bandai",
		"Thương hiệu đồ chơi và mô hình lắp ráp hàng đầu Nhật Bản",
		"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Bandai_Namco_Holdings_logo.svg/2560px-Bandai_Namco_Holdings_logo.svg.png",
		"bandai-logo"
	);

	const tamiyaBrand = await createBrand(
		"Tamiya",
		"Thương hiệu mô hình tĩnh và dụng cụ chất lượng cao",
		"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Tamiya_logo.svg/2560px-Tamiya_logo.svg.png",
		"tamiya-logo"
	);

	const godHandBrand = await createBrand(
		"GodHand",
		"Chuyên sản xuất kìm cắt mô hình cao cấp",
		"https://m.media-amazon.com/images/S/aplus-media/sc/4b0e0b0a-0b0a-4b0e-0b0a-4b0e0b0a4b0e.__CR0,0,600,180_PT0_SX600_V1___.jpg",
		"godhand-logo"
	);

	// 4. Create Products
	const createOrUpdateProduct = async (name: string, data: any) => {
		const existing = await prisma.product.findFirst({
			where: { productName: name },
		});

		// Prepare images
		const imagesData = [];
		if (data.images && data.images.create) {
			for (const img of data.images.create) {
				imagesData.push(img);
			}
		}

		if (existing) {
			// Update basic info
			await prisma.product.update({
				where: { id: existing.id },
				data: {
					description: data.description,
					price: data.price,
					stock: data.stock,
					categoryId: data.categoryId,
					brandId: data.brandId,
					isNewProduct: data.isNewProduct,
					isSale: data.isSale,
					discount: data.discount,
					isSpecial: data.isSpecial,
				},
			});

			// Update images: Delete old ones and create new ones (simplest way to ensure fresh URLs)
			await prisma.productImage.deleteMany({
				where: { productId: existing.id },
			});
			await prisma.productImage.createMany({
				data: imagesData.map((img: any) => ({
					...img,
					productId: existing.id,
				})),
			});

			// Variations: check if exist, if not create.
			// For seed simplicity, maybe delete and recreate variations too?
			// Let's leave variations alone if they exist to avoid ID churn if other things link to them (OrderDetails).
			// But we don't have orders yet.
			await prisma.productVariation.deleteMany({
				where: { productId: existing.id },
			});
			await prisma.productVariation.createMany({
				data: data.variations.create.map((v: any) => ({
					...v,
					productId: existing.id,
				})),
			});

			console.log(`Updated product: ${name}`);
		} else {
			await prisma.product.create({ data });
			console.log(`Created product: ${name}`);
		}
	};

	// RX-78-2 Gundam
	await createOrUpdateProduct("RX-78-2 Gundam", {
		productName: "RX-78-2 Gundam",
		price: 0,
		description:
			"Mobile Suit huyền thoại được điều khiển bởi Amuro Ray. Đây là mẫu Gundam mở đầu cho kỷ nguyên Universal Century.",
		categoryId: gundamCat!.id,
		brandId: bandaiBrand!.id,
		stock: 100,
		isNewProduct: false,
		isSale: false,
		isSpecial: true,
		images: {
			create: [
				{
					imageUrl: await fetchAndUploadImage(
						"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Gundam_RX-78-2.jpg/800px-Gundam_RX-78-2.jpg",
						"figure/products/rx78",
						"rx78-front"
					),
					isDefault: true,
				},
				{
					imageUrl: await fetchAndUploadImage(
						"https://placehold.co/600x800.png?text=RX-78-2+Rear",
						"figure/products/rx78",
						"rx78-rear"
					),
					isDefault: false,
				},
			],
		},
		variations: {
			create: [
				{
					attributeName: "Grade",
					attributeValue: "HG 1/144",
					price: 350000,
					quantity: 50,
				},
				{
					attributeName: "Grade",
					attributeValue: "MG 1/100",
					price: 1200000,
					quantity: 30,
				},
				{
					attributeName: "Grade",
					attributeValue: "PG 1/60",
					price: 4500000,
					quantity: 10,
				},
			],
		},
	});

	// Gundam Aerial
	await createOrUpdateProduct("XVX-016 Gundam Aerial", {
		productName: "XVX-016 Gundam Aerial",
		price: 0,
		description:
			"Mobile Suit chính trong series 'Mobile Suit Gundam: The Witch from Mercury', được điều khiển bởi Suletta Mercury.",
		categoryId: gundamCat!.id,
		brandId: bandaiBrand!.id,
		stock: 80,
		isNewProduct: true,
		isSale: false,
		isSpecial: true,
		images: {
			create: [
				{
					imageUrl: await fetchAndUploadImage(
						"https://placehold.co/600x800.png?text=Gundam+Aerial+Front",
						"figure/products/aerial",
						"aerial-front"
					),
					isDefault: true,
				},
				{
					imageUrl: await fetchAndUploadImage(
						"https://placehold.co/600x800.png?text=Gundam+Aerial+Rear",
						"figure/products/aerial",
						"aerial-rear"
					),
					isDefault: false,
				},
			],
		},
		variations: {
			create: [
				{
					attributeName: "Grade",
					attributeValue: "HG 1/144",
					price: 450000,
					quantity: 40,
				},
				{
					attributeName: "Grade",
					attributeValue: "Full Mechanics 1/100",
					price: 1100000,
					quantity: 20,
				},
			],
		},
	});

	// Gundam Unicorn
	await createOrUpdateProduct("RX-0 Unicorn Gundam", {
		productName: "RX-0 Unicorn Gundam",
		price: 0,
		description:
			"Mobile Suit biểu tượng của hy vọng, sở hữu hệ thống Psycho-Frame toàn thân.",
		categoryId: gundamCat!.id,
		brandId: bandaiBrand!.id,
		stock: 60,
		isNewProduct: false,
		isSale: true,
		discount: 15,
		isSpecial: false,
		images: {
			create: [
				{
					imageUrl: await fetchAndUploadImage(
						"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mobile_Suit_Gundam_Unicorn_logo.svg/1200px-Mobile_Suit_Gundam_Unicorn_logo.svg.png",
						"figure/products/unicorn",
						"unicorn-logo"
					),
					isDefault: true,
				},
				{
					imageUrl: await fetchAndUploadImage(
						"https://placehold.co/600x800.png?text=Unicorn+Destroy+Mode",
						"figure/products/unicorn",
						"unicorn-mode"
					),
					isDefault: false,
				},
			],
		},
		variations: {
			create: [
				{
					attributeName: "Grade",
					attributeValue: "HG 1/144",
					price: 600000,
					quantity: 30,
				},
				{
					attributeName: "Grade",
					attributeValue: "MG 1/100",
					price: 1500000,
					quantity: 20,
				},
				{
					attributeName: "Grade",
					attributeValue: "RG 1/144",
					price: 950000,
					quantity: 15,
				},
			],
		},
	});

	// Sazabi Ver.Ka
	await createOrUpdateProduct("MSN-04 Sazabi Ver.Ka", {
		productName: "MSN-04 Sazabi Ver.Ka",
		price: 2800000,
		description:
			"Mobile Suit tối thượng của Char Aznable, phiên bản Ver.Ka với độ chi tiết cực cao.",
		categoryId: gundamCat!.id,
		brandId: bandaiBrand!.id,
		stock: 15,
		isNewProduct: false,
		isSale: false,
		isSpecial: true,
		images: {
			create: [
				{
					imageUrl: await fetchAndUploadImage(
						"https://placehold.co/600x800.png?text=Sazabi+Ver.Ka",
						"figure/products/sazabi",
						"sazabi-front"
					),
					isDefault: true,
				},
			],
		},
		variations: {
			create: [
				{
					attributeName: "Grade",
					attributeValue: "MG 1/100",
					price: 2800000,
					quantity: 15,
				},
			],
		},
	});

	// God Hand Nippers
	await createOrUpdateProduct("Kìm cắt GodHand SPN-120 Ultimate Nipper", {
		productName: "Kìm cắt GodHand SPN-120 Ultimate Nipper",
		price: 1200000,
		description:
			"Kìm cắt mô hình tốt nhất thế giới, cho vết cắt siêu ngọt và phẳng.",
		categoryId: toolsCat!.id,
		brandId: godHandBrand!.id,
		stock: 20,
		isNewProduct: false,
		isSale: false,
		isSpecial: true,
		images: {
			create: [
				{
					imageUrl: await fetchAndUploadImage(
						"https://placehold.co/600x600.png?text=GodHand+SPN-120",
						"figure/products/godhand",
						"godhand-nipper"
					),
					isDefault: true,
				},
			],
		},
		variations: {
			create: [
				{
					attributeName: "Type",
					attributeValue: "Standard",
					price: 1200000,
					quantity: 20,
				},
			],
		},
	});

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

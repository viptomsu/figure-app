import React from "react";
import { getAllCategoriesServer } from "../../../services/categoryService";
import { ITopCategoriesData } from "../../../types/types";
import ConsumerElectronics from "./ConsumerElectronics/ConsumerElectronics";
import TopCategoriesList from "./TopCategoriesList/TopCategoriesList";

async function Categories() {
	const categoriesData = await getAllCategoriesServer(1, 12);
	const formattedCategories = categoriesData.content.map((category: any) => ({
		id: category._id,
		title: category.categoryName,
		img: category.image,
	}));

	const mouseCategory = formattedCategories.find(
		(category: { title: string }) => category.title === "Mô hình Gundam"
	);
	const keyboardCategory = formattedCategories.find(
		(category: { title: string }) => category.title === "Mô hình Dragon Ball"
	);
	const headphonesCategory = formattedCategories.find(
		(category: { title: string }) => category.title === "Mô hình One Piece"
	);

	return (
		<section id="categories">
			<div className="container">
				<TopCategoriesList categories={formattedCategories} />
				{mouseCategory && (
					<ConsumerElectronics
						title={"Mô hình Figure"}
						categoryId={mouseCategory.id}
					/>
				)}
				{keyboardCategory && (
					<ConsumerElectronics
						title={"Mô hình Dragon Ball"}
						categoryId={keyboardCategory.id}
					/>
				)}
				{headphonesCategory && (
					<ConsumerElectronics
						title={"Mô hình One Piece"}
						categoryId={headphonesCategory.id}
					/>
				)}
			</div>
		</section>
	);
}

export default Categories;

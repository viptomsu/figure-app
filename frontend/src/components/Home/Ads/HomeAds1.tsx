import { IAdsData1 } from "@/types/types";
import Link from "next/link";
import React from "react";

const HomeAds1: React.FC = () => {
	const AdsData1: IAdsData1[] = [
		{ id: 1, img: "ads/ads-1.jpg" },
		{ id: 2, img: "ads/ads-2.jpg" },
		{ id: 3, img: "ads/ads-3.jpg" },
	];

	return (
		<section id="ads-1" className="bg-white">
			<div className="container">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:pt-6">
					{AdsData1.map((item) => (
						<div key={item.id} className="w-full">
							<Link href="/shop">
								<img
									src={item.img}
									alt="ads-img"
									className="w-[416px] h-[224px] object-cover sm:w-full sm:h-auto sm:max-w-[416px] sm:max-h-[224px]"
								/>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HomeAds1;

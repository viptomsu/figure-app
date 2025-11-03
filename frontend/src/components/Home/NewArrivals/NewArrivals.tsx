import React from "react";
import Link from "next/link";
import ProductItem from "./ProductItem";
import { useProductsStore } from "../../../stores";
import { IButtonsAndLink } from "../../../types/types";

const NewArrivals: React.FC = () => {
  const { products } = useProductsStore();

  const ButtonsAndLinkData: IButtonsAndLink[] = [
    { id: 1, href: "#/", title: "Technologies" },
    { id: 2, href: "#/", title: "Electronic" },
    { id: 3, href: "#/", title: "Furnitures" },
    { id: 4, href: "#/", title: "Clothing & Apparel" },
    { id: 5, href: "#/", title: "Health & Beauty" },
    { id: 6, href: "/shop", title: "View All" },
  ];

  return (
    <section id="new-arrivals">
      <div className="container">
        <div className="section-header-wrapper">
          <div className="section-header">
            <div className="left-side">
              <div className="section-title">
                <h4>Hot New Arrivals</h4>
              </div>
            </div>
            <div className="right-side">
              <ul className="d-flex section-buttons-and-link">
                {ButtonsAndLinkData.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="product-item-wrapper">
          <div className="row">
            {products.map(
              (product: any, index: number) =>
                product.isNew === true && (
                  <div key={index} className="col-lg-3">
                    <ProductItem product={product} />
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

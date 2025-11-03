import React from "react";
import ContactUs from "./ContactUs";
import { LinksData } from "./FooterTopData";
import Link from "next/link";

const FooterTop: React.FC = () => {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="contact-us-wrapper">
          <ContactUs />
        </div>
        <div className="links-wrapper">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LinksData.map((item) => (
              <div key={item.id} className="links-item">
                <div className="title mb-4">
                  <h6 className="text-white font-semibold">{item.title}</h6>
                </div>
                <ul className="links m-0 space-y-2">
                  {item.links.map((linkItem) => (
                    <li key={linkItem.id}>
                      <Link href={linkItem.href} className="text-gray-300 hover:text-white transition-colors">{linkItem.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;

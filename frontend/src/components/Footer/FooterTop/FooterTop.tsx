import React from 'react';
import ContactUs from './ContactUs';
import { LinksData } from './FooterTopData';
import Link from 'next/link';

const FooterTop: React.FC = () => {
  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ContactUs />
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LinksData.map((item) => (
              <div key={item.id}>
                <div className="mb-6">
                  <h6 className="text-primary-foreground font-semibold text-lg">{item.title}</h6>
                </div>
                <ul className="m-0 pt-4 space-y-3">
                  {item.links.map((linkItem) => (
                    <li key={linkItem.id}>
                      <Link
                        href={linkItem.href}
                        className="text-muted-foreground hover:text-primary-foreground transition-colors duration-200 no-underline text-sm"
                      >
                        {linkItem.title}
                      </Link>
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

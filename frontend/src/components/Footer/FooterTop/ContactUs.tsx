import React from 'react';
import Link from 'next/link';
import { SocialMediaData } from '@/components/Other/SocialMediaData';

const ContactUs: React.FC = () => {
  return (
    <div className="contact-us">
      {/* ======= Title ======= */}
      <div className="contact-us-title">
        <h6 className="font-semibold mb-7.5">Liên hệ với chúng tôi</h6>
      </div>
      <div className="contact-us-content">
        {/* ======= Content - text ======= */}
        <div className="text">
          <p className="text-text text-sm">Gọi cho chúng tôi 24/7</p>
          <h3 className="text-2xl font-bold text-primary"> (+84) 0123456789</h3>
          <p className="text-text text-sm">
            Ba Vì, Hà Nội
            <br />
            <Link
              href="#/"
              className="text-text no-underline hover:text-primary transition-(--transition-normal)"
            >
              gundam-figure@gmail.com
            </Link>
          </p>
        </div>
        {/* ======= Content - social media ======= */}
        <div className="social-media">
          <ul className="flex items-center justify-between w-40 m-0 p-0 pt-6.25">
            {SocialMediaData.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className={item.class}>
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import React from 'react';
import { ContactItemsData } from './ContactItemsData';

const ContactItems: React.FC = () => {
  return (
    <section id="contact-items" className="py-22 pb-17.5">
      <div className="container">
        <div className="text-center pb-12.5">
          <h2 className="text-3xl font-semibold">Liên hệ với chúng tôi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ContactItemsData.map((item) => (
            <div key={item.id} className="pb-7.5">
              <div className="contact-item text-center">
                <div className="icon flex justify-center mb-2.5">
                  <h5 className="text-xl font-semibold">{item.title}</h5>
                </div>
                <div className="content">
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactItems;
import React from 'react';
import SubscribeForm from '../Other/SubscribeForm';

const Subscribe: React.FC = () => {
    return (
        <section id="subscribe" className="py-16.25 px-5 border-t border-b border-gray-200">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                    <div className="lg:col-span-2">
                        <div>
                            <h3 className="font-semibold mb-1.25 text-2xl">Newsletter</h3>
                            <p className="text-sm text-gray-600">Subcribe to get information about products and coupons</p>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div>
                            <SubscribeForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Subscribe;
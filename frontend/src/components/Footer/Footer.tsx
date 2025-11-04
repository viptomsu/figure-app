import React from 'react';
import FooterTop from './FooterTop/FooterTop';
import FooterMiddle from './FooterMiddle/FooterMiddle';
import FooterBottom from './FooterBottom/FooterBottom';

const Footer: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white pt-[70px] px-5">
            <div className="container">
                <div className="pb-12.5">
                    <FooterTop />
                </div>
                <div>
                    <FooterBottom />
                </div>
            </div>
        </div>
    )
}

export default Footer;
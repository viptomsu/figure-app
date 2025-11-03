import React from 'react';
import Link from 'next/link';

const FooterMiddle: React.FC = () => {
    return (
        <div className="footer-middle">
            <div className="footer-middle-links">
                <div className="links">
                    <ul className="link-item">
                        <li><h6>Consumer Electrics:</h6></li>
                        <li><Link href="#/">Air Conditioners</Link></li>
                        <li><Link href="#/">Audios & Theaters</Link></li>
                        <li><Link href="#/">Car Electronics</Link></li>
                        <li><Link href="#/">Office Electronics</Link></li>
                        <li><Link href="#/">TV Televisions</Link></li>
                        <li><Link href="#/">Washing Machines</Link></li>
                    </ul>
                    <ul className="link-item">
                        <li><h6>Clothing & Apparel:</h6></li>
                        <li><Link href="#/">Printers</Link></li>
                        <li><Link href="#/">Scanners</Link></li>
                        <li><Link href="#/">Store & Business</Link></li>
                        <li><Link href="#/">4K Ultra HD TVs</Link></li>
                        <li><Link href="#/">LED TVs</Link></li>
                        <li><Link href="#/">OLED TVs</Link></li>
                        <li><Link href="#/">Projectors</Link></li>
                    </ul>
                    <ul className="link-item">
                        <li><h6>Home, Garden & Kitchen:</h6></li>
                        <li><Link href="#/">Cookware</Link></li>
                        <li><Link href="#/">Decoration</Link></li>
                        <li><Link href="#/">Furniture</Link></li>
                        <li><Link href="#/">Garden Tools</Link></li>
                        <li><Link href="#/">Garden Equipments</Link></li>
                        <li><Link href="#/">Powers And Hand Tools</Link></li>
                        <li><Link href="#/">Utensil & Gadget</Link></li>
                    </ul>
                    <ul className="link-item">
                        <li><h6>Health & Beauty:</h6></li>
                        <li><Link href="#/">Hair Care</Link></li>
                        <li><Link href="#/">Decoration</Link></li>
                        <li><Link href="#/">Makeup</Link></li>
                        <li><Link href="#/">Body Shower</Link></li>
                        <li><Link href="#/">Skin Care</Link></li>
                        <li><Link href="#/">Cologine</Link></li>
                        <li><Link href="#/">Perfume</Link></li>
                    </ul>
                    <ul className="link-item">
                        <li><h6>Yewelry & Watches:</h6></li>
                        <li><Link href="#/">Necklace</Link></li>
                        <li><Link href="#/">Pendant</Link></li>
                        <li><Link href="#/">Diamond Ring</Link></li>
                        <li><Link href="#/">Sliver Earing</Link></li>
                        <li><Link href="#/">Leather Watcher</Link></li>
                        <li><Link href="#/">Gucci</Link></li>
                    </ul>
                    <ul className="link-item">
                        <li><h6>Computer & Technologies:</h6></li>
                        <li><Link href="#/">Desktop PC</Link></li>
                        <li><Link href="#/">Laptop</Link></li>
                        <li><Link href="#/">Smartphones</Link></li>
                        <li><Link href="#/">Tablet</Link></li>
                        <li><Link href="#/">Game Controller</Link></li>
                        <li><Link href="#/">Audio & Video</Link></li>
                        <li><Link href="#/">Wireless Speaker</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default FooterMiddle;
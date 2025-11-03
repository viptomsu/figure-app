import React from 'react';
import Award1 from '../../../assets/img/about/awards/award1.png';
import Award2 from '../../../assets/img/about/awards/award2.png';
import Award3 from '../../../assets/img/about/awards/award3.png';
import Award4 from '../../../assets/img/about/awards/award4.png';
import Award5 from '../../../assets/img/about/awards/award5.png';
import CustomCarousel from '@/components/Other/CustomCarousel';
import { IAwards } from '@/types/types';

const AwardsAndRecognition: React.FC = () => {
    const AwardsData: IAwards[] = [
        { id: 1, img: Award1.src, class: "award-1" },
        { id: 2, img: Award2.src, class: "award-2" },
        { id: 3, img: Award3.src, class: "award-3" },
        { id: 4, img: Award4.src, class: "award-4" },
        { id: 5, img: Award5.src, class: "award-5" }
    ];

    return (
        <section id="awards-and-recognition">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <div className="w-full">
                        <div className="section-title text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
                            <p className="text-gray-600">
                                Industry leaders and influencers recognize Overstock as one of the
                                most trust worthy retail companies in the U.S.,
                                ranking high for both customer and employee satisfaction.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="w-full">
                        <div className="awards">
                            <CustomCarousel>
                                {
                                    AwardsData.map(item => (
                                        <div key={item.id} className={item.class + " awards-img flex justify-center items-center"}>
                                            <img src={item.img} alt="awards" className="h-20 object-contain" />
                                        </div>
                                    ))
                                }
                            </CustomCarousel>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default AwardsAndRecognition;
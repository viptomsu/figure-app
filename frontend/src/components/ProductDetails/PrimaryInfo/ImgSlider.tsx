import React from 'react';
import ImageGallery from '@/components/ui/image-gallery';
import { IReactImgGalleryimages } from '@/types/types';

const ImgSlider: React.FC<any> = ({ product }) => {
    // Kiểm tra xem product.images có tồn tại và là một mảng không
    const images: IReactImgGalleryimages[] = product?.images?.map((image: any) => ({
        original: image.imageUrl,   // Sử dụng đường dẫn gốc của ảnh
        thumbnail: image.imageUrl,  // Sử dụng đường dẫn thumbnail (nếu có)
    })) || [];

    return (
        <div>
            <ImageGallery
                items={images}
                showPlayButton={false}
                showFullscreenButton={false}
                autoPlay={true}
            />
        </div>
    )
};

export default ImgSlider;

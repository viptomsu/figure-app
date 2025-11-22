import { getAllCategoriesServer } from '@/services/server';
import { getAllProductsServer } from '@/services/server/productService';
import ConsumerElectronics from './ConsumerElectronics/ConsumerElectronics';
import TopCategoriesList from './TopCategoriesList/TopCategoriesList';

async function Categories() {
  const categoriesData = await getAllCategoriesServer(1, 12);
  const formattedCategories = categoriesData.content.map((category: any) => ({
    id: category.id,
    title: category.categoryName,
    img: category.image,
  }));

  const mouseCategory = formattedCategories.find(
    (category: { title: string }) => category.title === 'Mô hình Gundam'
  );
  const keyboardCategory = formattedCategories.find(
    (category: { title: string }) => category.title === 'Mô hình Dragon Ball'
  );
  const headphonesCategory = formattedCategories.find(
    (category: { title: string }) => category.title === 'Mô hình One Piece'
  );

  // Fetch products for all 3 categories in parallel
  const [mouseProducts, keyboardProducts, headphonesProducts] = await Promise.all([
    mouseCategory
      ? getAllProductsServer('', mouseCategory.id, null, 1, 10)
      : Promise.resolve({ content: [] }),
    keyboardCategory
      ? getAllProductsServer('', keyboardCategory.id, null, 1, 10)
      : Promise.resolve({ content: [] }),
    headphonesCategory
      ? getAllProductsServer('', headphonesCategory.id, null, 1, 10)
      : Promise.resolve({ content: [] }),
  ]);

  return (
    <section id="categories">
      <div className="container">
        <TopCategoriesList categories={formattedCategories} />
        {mouseCategory && (
          <ConsumerElectronics title={'Mô hình Figure'} products={mouseProducts.content} />
        )}
        {keyboardCategory && (
          <ConsumerElectronics title={'Mô hình Dragon Ball'} products={keyboardProducts.content} />
        )}
        {headphonesCategory && (
          <ConsumerElectronics title={'Mô hình One Piece'} products={headphonesProducts.content} />
        )}
      </div>
    </section>
  );
}

export default Categories;

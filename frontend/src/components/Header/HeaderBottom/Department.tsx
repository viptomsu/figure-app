import { GiHamburgerMenu } from 'react-icons/gi';
import { VscChevronRight } from 'react-icons/vsc';
import DepartmentLink from './DepartmentLink';
import DepartmentCloseButton from './DepartmentCloseButton';
import { Category } from '@/services/types';

interface DepartmentProps {
  categories: Category[];
}

const Department = ({ categories }: DepartmentProps) => {
  return (
    <div className="department flex items-center justify-between h-full w-full max-w-65 cursor-pointer relative">
      <div className="icon">
        <span>
          <GiHamburgerMenu color="#ffffff" />
        </span>
      </div>

      <div className="text pl-3" style={{ color: '#ffffff' }}>
        <h6 className="font-semibold m-0">Danh mục sản phẩm</h6>
      </div>
      <div className="title" style={{ color: '#ffffff' }}>
        <h6>Danh mục sản phẩm</h6>
        <DepartmentCloseButton />
      </div>
      {/* ===== Departments ===== */}
      <ul
        className="departments"
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          scrollbarWidth: 'thin', // Dành cho Firefox
          scrollbarColor: '#cccccc transparent',
        }}
      >
        {categories.map((item: Category) =>
          item.submenu ? (
            <li key={item.categoryId} className="relative w-full transition-(--transition-normal)">
              <DepartmentLink
                href="/shop"
                className="flex justify-between w-full text-black block py-2.5 no-underline"
              >
                <p className="m-0 p-0">
                  <span>
                    {/* Nếu cần, hiển thị biểu tượng hoặc hình ảnh tại đây */}
                    <img src={item.image} alt={item.categoryName} className="w-6 h-6" />
                  </span>{' '}
                  {item.categoryName}
                </p>
                <span className="right-arrow">
                  <VscChevronRight />
                </span>
              </DepartmentLink>
              {/* Thêm logic submenu nếu có */}
            </li>
          ) : (
            <li key={item.id} className="relative w-full transition-(--transition-normal)">
              <DepartmentLink
                href={`/shop?category=${item.categoryId}`}
                className="text-black block w-full py-2.5 no-underline"
              >
                <span>
                  {/* Hiển thị hình ảnh danh mục */}
                  <img src={item.image} alt={item.categoryName} className="w-6 h-6" />
                </span>{' '}
                {item.categoryName}
              </DepartmentLink>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Department;

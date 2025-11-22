// header
export interface INavMenuDataTypes {
  id: string;
  icon: React.ReactNode;
  title: string;
  href: string;
  class: string;
}

export interface IActionDataTypes {
  id: string;
  href: string;
  sup: number;
  icon: React.ReactNode;
  class: string;
  dropdownContent?: React.ReactNode;
  func?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// categories list
export interface ICategoriesListDataTypes {
  id: string;
  title: string;
  icon: React.ReactNode;
  submenuTitle?: string;
  submenuTitle2?: string;
  submenu?: {
    id: string;
    title: string;
    category: string;
  }[];
}

// home > ads
export interface IAdsData1 {
  id: string;
  img: string;
}

// home > advantages
export interface IAdvantagesDataTypes {
  id: string;
  icon: React.ReactNode;
  title: string;
  paragraph: string;
}

// home > banner
export interface ISliderDataTypes {
  id: string;
  img: string;
}

export interface IBannerRightDataTypes {
  id: string;
  img: string;
}

// home > categories
export interface IButtonsAndLink {
  id: string;
  href: string;
  title: string;
}

// home > section-header
export interface ISectionHeaderProps {
  title: string;
}

// home > top categories
export interface ITopCategoriesData {
  id: string;
  title: string;
  img: string;
}

// home > download-app
export interface ISmallImages {
  id: string;
  img: string;
}

// social media
export interface ISocialMedia {
  id: string;
  href: string;
  icon: React.ReactNode;
  class: string;
}

// react image-gallery
export interface IReactImgGalleryOptions {
  showPlayButton: boolean;
  showFullscreenButton: boolean;
  autoPlay: boolean;
}

export interface IReactImgGalleryimages {
  original: any;
  thumbnail: any;
}

// product-details > tab list
export interface ITabList {
  id: string;
  title: string;
  reviewCount?: number;
}

// about > team
export interface ITeam {
  id: string;
  img: string;
  name: string;
  position: string;
  twitter: string;
  facebook: string;
  linkedin: string;
}

// about > team bg img
export interface ITeamBgImgStyle {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
  height: string;
}

// about > awards
export interface IAwards {
  id: string;
  img: string;
  class: string;
}

// product
export interface IProducts {
  _id: string;
  id: string;
  img: string;
  title: string;
  price: number;
  label: string;
  rating: number;
  brand: string;
  category: string;
  hasDiscount: boolean;
  isNew: boolean;
  count: number;
  isInCart: boolean;
  isInWishlist: boolean;
  isInCompare: boolean;
  previousPrice?: number;
}

export interface IProductProps {
  product: IProducts;
}

// shop > brands section
export interface IBrandsSection {
  id: string;
  img: string;
  link: string;
}

// shop > filter > brands
export interface IBrands {
  id: string;
  title: string;
  value: string;
}

// shop > range-slider
export interface RangeSliderProps {
  min: number;
  max: number;
  onChange: Function;
}

// shop > pagination
export interface IPaginationProps {
  pages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

// contact items
export interface IContactItems {
  id: string;
  title: string;
  content: React.ReactNode;
}

// footer bottom
export interface IPayment {
  id: string;
  img: string;
}

// footer links
export interface ILinks {
  id: string;
  title: string;
  links: {
    id: string;
    title: string;
    href: string;
  }[];
}

// rating
export interface IRatingProps {
  value: number;
  color?: string;
}

// shopping cart
export interface ICartProps {
  cart: any;
}

// product reducer
export interface IProductReducerState {
  products: any[];
  searchedProducts: IProducts[];
}

// primary reducer
export interface IPrimaryReducerState {
  title: string;
  showSidebarCategories: boolean;
  showSidebarMenu: boolean;
  isLoading: boolean;
  showSearchArea: boolean;
  showOrHideDropdownCart: boolean;
  showSidebarFilter: boolean;
}

import { FaBlog, FaHome } from "react-icons/fa";
import { INavMenuDataTypes } from "../../../types/types";
import { GiVintageRobot } from "react-icons/gi";
import { MdContactPhone } from "react-icons/md";

export const NavLinksData: INavMenuDataTypes[] = [
  {
    id: 1,
    icon: <FaHome />,
    title: "Trang chủ",
    href: "/",
    class: "first-li",
  },
  {
    id: 2,
    icon: <GiVintageRobot />,
    title: "Sản phẩm",
    href: "/shop",
    class: "third-li",
  },
  {
    id: 3,
    icon: <FaBlog />,
    title: "Bài viết",
    href: "/about",
    class: "second-li",
  },
  {
    id: 4,
    icon: <MdContactPhone />,
    title: "Liên hệ",
    href: "/contact",
    class: "fourth-li",
  },
];

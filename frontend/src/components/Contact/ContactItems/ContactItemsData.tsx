import { IContactItems } from "../../../types/types";

// contact items text
const contactDirectlyText = (
  <>
    nguyenvinhtuyen1805@gmail.com
    <br />
    (+84) 557-771-315
  </>
);

const headQuaterText = <>Ba Vì, Hà Nội</>;

const workWithUsText = (
  <>
    Gửi thông tin của bạn đến email:
    <br />
    vietducforindiv@gmail.com
  </>
);

const customerServiceText = (
  <>
    vietducforindiv@gmail.com
    <br />
    (+84) 0368654275
  </>
);

const mediaRelationsText = (
  <>
    vietducforindiv@gmail.com
    <br />
    (+84) 0368654275
  </>
);

const vendorSupportText = (
  <>
    vietducforindiv@gmail.com
    <br />
    (+84) 557-771-315
  </>
);

// contact items data
export const ContactItemsData: IContactItems[] = [
  {
    id: 1,
    title: "Liên hệ trực tiếp",
    content: contactDirectlyText,
  },
  {
    id: 2,
    title: "Chi nhánh chính",
    content: headQuaterText,
  },
  {
    id: 3,
    title: "Cộng tác với chúng tôi",
    content: workWithUsText,
  },
  {
    id: 4,
    title: "Dịch vụ khách hàng",
    content: customerServiceText,
  },
  {
    id: 5,
    title: "Quan hệ truyền thông",
    content: mediaRelationsText,
  },
  {
    id: 6,
    title: "Hỗ trợ đối tác",
    content: vendorSupportText,
  },
];

import { IContactItems } from '../../../types/types';

// contact items text
const contactDirectlyText = (
  <>
    figure-contact@gmail.com
    <br />
    (+84) 987-654-321
  </>
);

const headQuaterText = <>Ba Vì, Hà Nội</>;

const workWithUsText = (
  <>
    Gửi thông tin của bạn đến email:
    <br />
    gundam-figure@gmail.com
  </>
);

const customerServiceText = (
  <>
    gundam-figure@gmail.com
    <br />
    (+84) 0123456789
  </>
);

const mediaRelationsText = (
  <>
    gundam-figure@gmail.com
    <br />
    (+84) 0123456789
  </>
);

const vendorSupportText = (
  <>
    gundam-figure@gmail.com
    <br />
    (+84) 987-654-321
  </>
);

// contact items data
export const ContactItemsData: IContactItems[] = [
  {
    id: '1',
    title: 'Liên hệ trực tiếp',
    content: contactDirectlyText,
  },
  {
    id: '2',
    title: 'Chi nhánh chính',
    content: headQuaterText,
  },
  {
    id: '3',
    title: 'Cộng tác với chúng tôi',
    content: workWithUsText,
  },
  {
    id: '4',
    title: 'Dịch vụ khách hàng',
    content: customerServiceText,
  },
  {
    id: '5',
    title: 'Quan hệ truyền thông',
    content: mediaRelationsText,
  },
  {
    id: '6',
    title: 'Hỗ trợ đối tác',
    content: vendorSupportText,
  },
];

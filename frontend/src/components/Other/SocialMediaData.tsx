import { Facebook, Twitter, Instagram, Chrome } from 'lucide-react';
import { ISocialMedia } from '../../types/types';

export const SocialMediaData: ISocialMedia[] = [
  {
    id: '1',
    href: 'https://www.facebook.com',
    icon: <Facebook className="w-5 h-5" />,
    class: 'facebook',
  },
  {
    id: '2',
    href: 'https://www.x.com',
    icon: <Twitter className="w-5 h-5" />,
    class: 'twitter',
  },
  {
    id: '3',
    href: 'https://www.google.com',
    icon: <Chrome className="w-5 h-5" />,
    class: 'google',
  },
  {
    id: '4',
    href: 'https://www.instagram.com',
    icon: <Instagram className="w-5 h-5" />,
    class: 'instagram',
  },
];

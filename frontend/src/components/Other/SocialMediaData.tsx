import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { AiOutlineGooglePlus, AiOutlineInstagram } from "react-icons/ai";
import { ISocialMedia } from "../../types/types";

export const SocialMediaData: ISocialMedia[] = [
  {
    id: 1,
    href: "https://www.facebook.com",
    icon: <TiSocialFacebook />,
    class: "facebook",
  },
  {
    id: 2,
    href: "https://www.x.com",
    icon: <TiSocialTwitter />,
    class: "twitter",
  },
  {
    id: 3,
    href: "https://www.google.com",
    icon: <AiOutlineGooglePlus />,
    class: "google",
  },
  {
    id: 4,
    href: "https://www.instagram.com",
    icon: <AiOutlineInstagram />,
    class: "instagram",
  },
];

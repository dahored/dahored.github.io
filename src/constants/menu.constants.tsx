export const NAV_MENU = [
  { label: "Me", href: "/me", submenus: [] },
  {
    label: "Social",
    href: "/social",
    submenus: [
      {
        label: "Explore social networks",
        items: [
          {
            label: "Facebook",
            href: "https://www.facebook.com/",
          },
          {
            label: "Twitter",
            href: "https://twitter.com/",
          },
          {
            label: "Instagram",
            href: "https://www.instagram.com/",
          },
        ],
      },
      {
        label: "View Followers",
        items: [
          {
            label: "Followers",
            href: "/followers",
          },
        ],
      },
    ],
  },
];

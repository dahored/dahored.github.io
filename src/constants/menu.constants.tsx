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
  {
    label: "Projects",
    href: "/projects",
    submenus: [
      {
        label: "Explore projects networks",
        items: [
          {
            label: "Github",
            href: "https://github.com/",
          },
          {
            label: "Linkedin",
            href: "https://www.linkedin.com/",
          },
          {
            label: "Stackoverflow",
            href: "https://stackoverflow.com/",
          },
          {
            label: "Medium",
            href: "https://medium.com/",
          },
        ],
      },
    ],
  },
];

export const PROFILE_MENU = [
  { label: "Profile", href: "/profile", icon: "UserCircleGearIcon" },
  { label: "Account", href: "/account", icon: "UserListIcon" },
  { label: "Billing", href: "/billing", icon: "WalletIcon" },
  { label: "Close Session", action: "closeSession", icon: "SignOutIcon" },
];

type NavMenuItem = {
  key: string;
  href: string;
  submenus?: Array<{
    key: string;
    items: Array<{
      key: string;
      href: string;
    }>;
  }>;
};

type ProfileMenuItem = {
  key: string;
  href?: string;
  action?: "closeSession";
  icon: "UserCircleGearIcon" | "UserListIcon" | "WalletIcon" | "SignOutIcon";
};

export const NAV_MENU_ITEMS: NavMenuItem[] = [
  { key: "me", href: "/me", submenus: [] },
  {
    key: "social",
    href: "/social",
    submenus: [
      {
        key: "exploreSocialNetworks",
        items: [
          {
            key: "facebook",
            href: "https://www.facebook.com/",
          },
          {
            key: "twitter",
            href: "https://twitter.com/",
          },
          {
            key: "instagram",
            href: "https://www.instagram.com/",
          },
        ],
      },
      {
        key: "viewFollowers",
        items: [
          {
            key: "followers",
            href: "/followers",
          },
        ],
      },
    ],
  },
  {
    key: "projects",
    href: "/projects",
    submenus: [
      {
        key: "exploreProjectsNetworks",
        items: [
          {
            key: "github",
            href: "https://github.com/",
          },
          {
            key: "linkedin",
            href: "https://www.linkedin.com/",
          },
          {
            key: "stackoverflow",
            href: "https://stackoverflow.com/",
          },
          {
            key: "medium",
            href: "https://medium.com/",
          },
        ],
      },
    ],
  },
];

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { key: "profile", href: "/profile", icon: "UserCircleGearIcon" },
  { key: "account", href: "/account", icon: "UserListIcon" },
  { key: "billing", href: "/billing", icon: "WalletIcon" },
  { key: "closeSession", action: "closeSession", icon: "SignOutIcon" },
];

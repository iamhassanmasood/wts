export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      // badge: {
      //   variant: 'info',
      //   text: 'NEW',
      // },
    },
    {
      name: 'Alerts',
      url: '/Alerts',
      icon: 'fa fa-bell',
    },
    {
      name: 'Management',
      url: '/management',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Site Management',
          url: '/management/SiteManagement',
          icon: 'fa fa-sitemap',
        },
        {
          name: 'Asset Management',
          url: '/management/AssetManagement',
          icon: 'fa fa-ticket',
        },
        {
          name: 'Device Managemnt',
          url: '/management/DeviceManagement',
          icon: 'fa fa-tablet',
        },
        {
          name: 'Tag Management',
          url: '/management/TagManagement',
          icon: 'fa fa-tag',
        },
        {
          name: 'Region Managemnt',
          url: '/management/RegionManagement',
          icon: 'fa fa-apple',
        },
        {
          name: 'Site Configuration',
          url: '/management/SiteConfiguration',
          icon: 'fa fa-apple',
        },

      ],
    },
    {
      name: 'Transfer Assets',
      url: '/TransferAssets',
      icon: 'fa fa-exchange',
    },
    {
      name: 'Reports',
      url: '/Reports',
      icon: 'fa fa-clipboard',
      children: [
        {
          name: 'General Reports',
          url: '/Reports/GeneralReports',
          icon: 'fa fa-clipboard',
        },
        {
          name: 'Progress Reports',
          url: '/Reports/ProgressReports',
          icon: 'fa fa-clipboard',
        },
      ],
    },

  ],
};

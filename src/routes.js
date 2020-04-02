import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Management = React.lazy(() => import('./views/Management/Management'))
const DeviceManagement = React.lazy(() => import('./views/Management/DeviceManagement'));
const AssetManagement = React.lazy(() => import('./views/Management/AssetManagement'));
const TagManagement = React.lazy(() => import('./views/Management/TagManagement'));
const SiteManagement = React.lazy(() => import('./views/Management/SiteManagement/SiteManagement'));
const RegionManagement = React.lazy(() => import('./views/Management/RegionManagement'));
const SiteConfiguration = React.lazy(() => import('./views/Management/SiteConfiguration/SiteConfiguration'));
const TransferAssets = React.lazy(() => import('./views/TransferAssets'));
const Alerts = React.lazy(() => import('./views/Alerts/Alerts'))
const Reports = React.lazy(() => import('./views/Reports/Reports/Reports'))
const GeneralReports = React.lazy(() => import('./views/Reports/GeneralReports/GeneralReports'))
const ProgressReports = React.lazy(() => import('./views/Reports/ProgressReports/ProgressReports'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/dashboard/networklevel', name: 'Dashboard', component: Dashboard },
  { path: '/dashboard/sitelevel', name: 'Dashboard', component: Dashboard },
  { path: '/dashboard/assetlevel', name: 'Dashboard', component: Dashboard },
  { path: '/management', exact: true, name: 'Management', component: Management },
  { path: '/management/DeviceManagement', name: 'DeviceManagement', component: DeviceManagement },
  { path: '/management/SiteManagement', name: 'SiteManagement', component: SiteManagement },
  { path: '/management/AssetManagement', name: 'AssetManagement', component: AssetManagement },
  { path: '/management/TagManagement', name: 'TagManagement', component: TagManagement },
  { path: '/management/RegionManagement', name: 'RegionManagement', component: RegionManagement },
  { path: '/management/SiteConfiguration', name: 'SiteConfiguration', component: SiteConfiguration },
  { path: '/TransferAssets', exact: true, name: 'TransferAssets', component: TransferAssets },
  { path: '/Alerts', exact: true, name: 'Alerts', component: Alerts },
  { path: '/Reports', exact: true, name: 'Reports', component: Reports },
  { path: '/Reports/GeneralReports', exact: true, name: 'GeneralReports', component: GeneralReports },
  { path: '/Reports/ProgressReports', exact: true, name: 'ProgressReports', component: ProgressReports },
];

export default routes;

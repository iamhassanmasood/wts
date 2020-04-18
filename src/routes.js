import React from 'react';

import Dashboard from './views/Dashboard';
import Management from './views/Management/Management'
import DeviceManagement from './views/Management/DeviceManagement';
import AssetManagement from './views/Management/AssetManagement';
import TagManagement from './views/Management/TagManagement';
import SiteManagement from './views/Management/SiteManagement/SiteManagement';
import RegionManagement from './views/Management/RegionManagement';
import SiteConfiguration from './views/Management/SiteConfiguration/SiteConfiguration';
import TransferAssets from './views/TransferAssets';
import Alerts from './views/Alerts/Alerts'
import Reports from './views/Reports/Reports/Reports'
import GeneralReports from './views/Reports/GeneralReports/GeneralReports'
import ProgressReports from './views/Reports/ProgressReports/ProgressReports'

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

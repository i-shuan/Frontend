import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Switch, Routes } from 'react-router-dom';
import { SettingOutlined, PieChartOutlined, FolderViewOutlined, MessageOutlined, HomeOutlined, BulbOutlined} from '@ant-design/icons';
import Layouts from "./Layouts/Layouts"
import HomePage from "./HomePage/HomePage"
import DashboardPage from './DashboardPage/DashboardPage';
import ConfigManagerPage from './ConfigManager/ConfigManagerPage';
import SecsSignalsTable from './SecsSignalsTable/SecsSignalsTable'

function App() {

  const menuItems = [
    { key: '0', group: 'MAIN', icon: <HomeOutlined />, title: 'HOME', path:"/" },
    { key: '1', group: 'MAIN', icon: <PieChartOutlined />, title: 'DASHBOARD', path:"/Dashboard" },
    { key: '2', group: 'MAIN', icon: <FolderViewOutlined />, title: 'TOOL VIEWER' },
    { key: '3', group: 'MAIN', icon: <SettingOutlined />, title: 'Config Manager', path:"/ConfigManager" },
    { key: '4', group: 'MAIN', icon: <BulbOutlined /> , title: 'Secs Signal', path:"/SecsSignalsTable" },
    { key: '5', group: 'OTHERS', icon: <MessageOutlined />, title: 'CONTACT US' },
  ];

  
  return (
    <div className="App">
      <HashRouter>
      <Layouts menuItems={menuItems}>     
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Dashboard" element={<DashboardPage />} />
          <Route path="/ConfigManager" element={<ConfigManagerPage/>} />
          <Route path="/SecsSignalsTable" element={<SecsSignalsTable/>} />
        </Routes>     
      </Layouts>
      </HashRouter>
    </div>
  );
}

export default App;

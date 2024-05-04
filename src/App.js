import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Switch, Routes } from 'react-router-dom';
import { SettingOutlined, PieChartOutlined, FolderViewOutlined, MessageOutlined, HomeOutlined, BulbOutlined} from '@ant-design/icons';
import Layouts from "./Layouts/Layouts"
import HomePage from "./HomePage/LandingPage"
import FileManagerPage from './FileManagerPage/FileManagerPage';
function App() {

  const menuItems = [
    { key: '0', group: 'MAIN', icon: <HomeOutlined />, title: 'HOME', path:"/", content:"Home Page" },
    // { key: '1', group: 'MAIN', icon: <PieChartOutlined />, title: 'DASHBOARD', path:"/Dashboard" },
    // { key: '2', group: 'MAIN', icon: <FolderViewOutlined />, title: 'TOOL VIEWER' },
    // { key: '3', group: 'MAIN', icon: <SettingOutlined />, title: 'Config Manager', path:"/ConfigManager" },
    // { key: '4', group: 'MAIN', icon: <BulbOutlined /> , title: 'SECS SIGNAL', path:"/SecsSignalsTable" },
    { key: '5', group: 'MAIN', icon: <BulbOutlined /> , title: 'FileManager', path:"/FileManagerPage",content:"Secs Command Editor" },
  ];

  
  return (
    <div className="App">
      <HashRouter>
      <Layouts menuItems={menuItems}>     
        <Routes>
          <Route path="/" element={<HomePage menuItems={menuItems}/>} />
          {/* <Route path="/Dashboard" element={<DashboardPage />} />
          <Route path="/ConfigManager" element={<ConfigManagerPage/>} />
          <Route path="/SecsSignalsTable" element={<SecsSignalsTable/>} /> */}
          <Route path="/FileManagerPage" element={<FileManagerPage/>} />
        </Routes>     
      </Layouts>
      </HashRouter>
    </div>
  );
}

export default App;

import Header from './Header';
import { Outlet } from 'react-router-dom';
import Chatbot from './chatbot/Chatbot';

export default function Layout() {
  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="main">
        <div
          style={{ width: '400px', height: '400px', background: 'black' }}
        ></div>
        <Chatbot />
      </div>
    </div>
  );
}

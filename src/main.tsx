import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Force update when new content is available
registerSW({
  onNeedRefresh() {
    if (confirm('มีเวอร์ชันใหม่พร้อมใช้งาน! คุณต้องการอัปเดตตอนนี้หรือไม่?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('App ready for offline use');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

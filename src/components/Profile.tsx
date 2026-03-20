import React, { useRef } from 'react';
import { PersonalData, CheckupData, ReminderSettings, AppState } from '../types';
import { Bell, BellOff, Info, Download, Upload, Database } from 'lucide-react';

interface ProfileProps {
  personalData: PersonalData;
  checkupData: CheckupData;
  reminderSettings: ReminderSettings;
  updatePersonalData: (data: Partial<PersonalData>) => void;
  updateCheckupData: (data: Partial<CheckupData>) => void;
  updateReminderSettings: (data: Partial<ReminderSettings>) => void;
  appState: AppState;
  importAppState: (state: AppState) => void;
}

export default function Profile({ 
  personalData, 
  checkupData, 
  reminderSettings,
  updatePersonalData, 
  updateCheckupData,
  updateReminderSettings,
  appState,
  importAppState
}: ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalData({ [e.target.name]: e.target.value });
  };

  const handleCheckupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCheckupData({ [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `if-12week-backup-${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const content = event.target?.result;
          if (typeof content === 'string') {
            const importedData = JSON.parse(content);
            // Basic validation
            if (importedData.personalData && importedData.checkupData) {
              if (window.confirm('คุณต้องการนำเข้าข้อมูลนี้ใช่หรือไม่? ข้อมูลปัจจุบันจะถูกแทนที่ด้วยข้อมูลจากไฟล์สำรอง')) {
                importAppState(importedData);
                alert('นำเข้าข้อมูลสำเร็จ!');
              }
            } else {
              alert('รูปแบบไฟล์ไม่ถูกต้อง');
            }
          }
        } catch (error) {
          alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' + error);
        }
      };
    }
    // Reset input
    if (e.target) e.target.value = '';
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน');
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateReminderSettings({ dailyEnabled: true });
      new Notification('เปิดการแจ้งเตือนสำเร็จ!', {
        body: 'คุณจะได้รับการแจ้งเตือนเมื่อถึงเวลาที่กำหนด',
        icon: 'mask-icon.svg'
      });
    }
  };

  const toggleDaily = () => {
    if (!reminderSettings.dailyEnabled) {
      requestNotificationPermission();
    } else {
      updateReminderSettings({ dailyEnabled: false });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Data Management Section - Moved to top for visibility */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-stone-800">จัดการข้อมูล (สำรอง/นำเข้า)</h2>
          </div>
          <span className="text-[10px] text-stone-400">Build: 20260320-0805</span>
        </div>
        <div className="p-6">
          <p className="text-sm text-stone-600 mb-6">
            คุณสามารถสำรองข้อมูลทั้งหมดเก็บไว้ในเครื่องคอมพิวเตอร์ หรือนำข้อมูลที่เคยสำรองไว้กลับมาใช้งานได้ 
            ข้อมูลนี้จะรวมถึงบันทึกรายวันและประเมินรายสัปดาห์ทั้งหมด
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Download className="h-5 w-5" />
              สำรองข้อมูล (ดาวน์โหลดไฟล์)
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
            >
              <Upload className="h-5 w-5" />
              นำเข้าข้อมูลจากไฟล์
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              <strong>คำแนะนำ:</strong> ควรสำรองข้อมูลเป็นประจำ 
              หากคุณต้องการส่งข้อมูลเข้าอีเมล ให้ดาวน์โหลดไฟล์นี้แล้วแนบไฟล์ส่งไปที่อีเมลของคุณเองได้เลยครับ
            </p>
          </div>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-amber-800">ตั้งค่าการแจ้งเตือน (Reminders)</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
            <Info className="h-3 w-3" />
            <span>PWA Feature</span>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div>
              <h3 className="font-medium text-stone-800">แจ้งเตือนบันทึกพฤติกรรมรายวัน</h3>
              <p className="text-xs text-stone-500">เตือนให้คุณบันทึกข้อมูลก่อนจบวัน</p>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="time" 
                value={reminderSettings.dailyTime}
                onChange={(e) => updateReminderSettings({ dailyTime: e.target.value })}
                className="px-2 py-1 bg-white border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={toggleDaily}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  reminderSettings.dailyEnabled
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {reminderSettings.dailyEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                {reminderSettings.dailyEnabled ? 'เปิดอยู่' : 'ปิดอยู่'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div>
              <h3 className="font-medium text-stone-800">แจ้งเตือนประเมินรายสัปดาห์</h3>
              <p className="text-xs text-stone-500">เตือนให้คุณสรุปผลในวันหยุด</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={reminderSettings.weeklyDay}
                onChange={(e) => updateReminderSettings({ weeklyDay: parseInt(e.target.value) })}
                className="px-2 py-1 bg-white border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={0}>วันจันทร์</option>
                <option value={1}>วันอังคาร</option>
                <option value={2}>วันพุธ</option>
                <option value={3}>วันพฤหัสบดี</option>
                <option value={4}>วันศุกร์</option>
                <option value={5}>วันเสาร์</option>
                <option value={6}>วันอาทิตย์</option>
              </select>
              <input 
                type="time" 
                value={reminderSettings.weeklyTime}
                onChange={(e) => updateReminderSettings({ weeklyTime: e.target.value })}
                className="px-2 py-1 bg-white border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => updateReminderSettings({ weeklyEnabled: !reminderSettings.weeklyEnabled })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  reminderSettings.weeklyEnabled
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {reminderSettings.weeklyEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                {reminderSettings.weeklyEnabled ? 'เปิดอยู่' : 'ปิดอยู่'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
          <h2 className="text-lg font-semibold text-emerald-800">เป้าหมายหลัก 3 ประการ</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">1</div>
            <div 
              className="flex items-center gap-2 text-stone-700 flex-wrap cursor-help group relative"
              title="เป้าหมายระยะสั้น (3 เดือนแรก): ลดลงให้ได้ 0.5% - 1.0% ถือว่าประสบความสำเร็จอย่างมากในการปรับเปลี่ยนพฤติกรรม"
            >
              <span>ต้องการลด HbA1c จาก</span>
              <input
                type="text"
                name="goal1Start"
                value={personalData.goal1Start || ''}
                onChange={handlePersonalChange}
                className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span>% ให้เหลือต่ำกว่า</span>
              <input
                type="text"
                name="goal1Target"
                value={personalData.goal1Target || ''}
                onChange={handlePersonalChange}
                className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span>%</span>
              
              {/* Custom Tooltip for better visibility */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-stone-800 text-white text-xs rounded-xl shadow-xl z-20 animate-in fade-in slide-in-from-bottom-2">
                เป้าหมายระยะสั้น (3 เดือนแรก): ลดลงให้ได้ 0.5% - 1.0% ถือว่าประสบความสำเร็จอย่างมากในการปรับเปลี่ยนพฤติกรรม
                <div className="absolute top-full left-4 border-8 border-transparent border-t-stone-800"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">2</div>
            <div className="flex items-center gap-2 text-stone-700 flex-wrap">
              <span>ลดขนาดของยาเบาหวานจาก</span>
              <input
                type="text"
                name="goal2Start"
                value={personalData.goal2Start || ''}
                onChange={handlePersonalChange}
                className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span>(เม็ด) เป็น</span>
              <input
                type="text"
                name="goal2Target"
                value={personalData.goal2Target || ''}
                onChange={handlePersonalChange}
                className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span>(เม็ด)</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mt-1">3</div>
            <div className="flex items-center gap-2 text-stone-700 flex-wrap">
              <span>เพิ่มความแข็งแรงของร่างกาย โดยเดินอย่างน้อยวันละ</span>
              <input
                type="text"
                name="goal3Steps"
                value={personalData.goal3Steps || ''}
                onChange={handlePersonalChange}
                className="w-24 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span>ก้าว และฝึกยืดเส้นฯ อย่างน้อย</span>
              <input
                type="text"
                name="goal3StretchingTime"
                value={personalData.goal3StretchingTime || ''}
                onChange={handlePersonalChange}
                className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span>นาที ความถี่ อย่างน้อย</span>
              <input
                type="text"
                name="goal3StretchingFrequency"
                value={personalData.goal3StretchingFrequency || ''}
                onChange={handlePersonalChange}
                className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span>วัน/สัปดาห์</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">ข้อมูลส่วนตัว</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'ส่วนสูง (ซม.)', name: 'height', value: personalData.height },
              { label: 'น้ำหนักเริ่มต้น (กก.)', name: 'startWeight', value: personalData.startWeight },
              { label: 'น้ำหนักเป้าหมาย (กก.)', name: 'targetWeight', value: personalData.targetWeight },
              { label: 'ขนาดรอบเอวเริ่มต้น (นิ้ว)', name: 'startWaist', value: personalData.startWaist },
              { label: 'ขนาดรอบเอวเป้าหมาย (นิ้ว)', name: 'targetWaist', value: personalData.targetWaist },
              { label: 'ระดับน้ำตาลหลังงดอาหารปัจจุบัน', name: 'currentFastingSugar', value: personalData.currentFastingSugar },
              { label: 'ระดับน้ำตาลหลังงดอาหารเป้าหมาย', name: 'targetFastingSugar', value: personalData.targetFastingSugar },
            ].map((field) => (
              <div key={field.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-medium text-stone-600">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handlePersonalChange}
                  className="w-full sm:w-32 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">บันทึกข้อมูลการตรวจครั้งล่าสุด</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'HbA1C ปัจจุบัน', name: 'currentHbA1c', value: checkupData.currentHbA1c },
              { label: 'ระดับความดันโลหิตปัจจุบัน', name: 'currentBP', value: checkupData.currentBP },
              { label: 'ระดับไตรกลีเซอไรด์ปัจจุบัน', name: 'currentTriglycerides', value: checkupData.currentTriglycerides },
              { label: 'HDL ปัจจุบัน', name: 'currentHDL', value: checkupData.currentHDL },
              { label: 'LDL ปัจจุบัน', name: 'currentLDL', value: checkupData.currentLDL },
            ].map((field) => (
              <div key={field.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-medium text-stone-600">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handleCheckupChange}
                  className="w-full sm:w-32 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

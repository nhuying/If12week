import React, { useState } from 'react';
import { Send, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';

export default function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const googleFormUrl = 'https://forms.gle/GZEK9uXPWGPFu2PH8';
    window.open(googleFormUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Share Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-2xl">
            <ExternalLink className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-800">ส่งต่อให้เพื่อน</h3>
            <p className="text-sm text-stone-500">แบ่งปันเครื่องมือนี้ให้เพื่อนของคุณได้ทดลองใช้</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-stone-50 px-4 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm truncate">
            {shareUrl}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all active:scale-95 whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
          </button>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-2xl">
            <MessageSquare className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-800">แบบประเมินความพึงพอใจ</h3>
            <p className="text-sm text-stone-500">ช่วยเราพัฒนาแอปให้ดียิ่งขึ้นด้วยการตอบแบบสอบถามสั้นๆ</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
            <h4 className="font-bold text-stone-800 mb-2">ทำไมต้องใช้ Google Forms?</h4>
            <ul className="text-sm text-stone-600 space-y-2 list-disc list-inside">
              <li>เก็บข้อมูลเป็นระบบและเป็นสถิติ</li>
              <li>ไม่เปิดเผยอีเมลส่วนตัวของผู้ตอบ</li>
              <li>วิเคราะห์ผลลัพธ์ได้ง่ายผ่าน Google Sheets</li>
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-stone-800 text-white rounded-2xl font-bold hover:bg-stone-900 transition-all active:scale-[0.98] shadow-lg shadow-stone-200"
          >
            <ExternalLink className="w-5 h-5" />
            เปิดแบบฟอร์ม Google Forms
          </button>
          
          <p className="text-center text-xs text-stone-400">
            * ระบบจะเปิดหน้าต่างใหม่เพื่อไปยัง Google Forms
          </p>
        </div>
      </div>
    </div>
  );
}

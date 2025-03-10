import React from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">設定</h1>

      <div className="bg-white rounded-xl shadow-sm border border-indigo-50">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">一般設定</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">スタジオ名</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="アニメスタジオ制作部"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="contact@animestudio.co.jp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">タイムゾーン</label>
              <select className="mt-1 block w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option>東京 (GMT+9)</option>
                <option>ロサンゼルス (GMT-8)</option>
                <option>ロンドン (GMT+0)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">通知設定</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-indigo-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">作品の更新通知</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-indigo-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">スケジュール変更通知</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-indigo-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">スタッフ配属通知</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 shadow-sm">
              <Save className="w-5 h-5" />
              変更を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
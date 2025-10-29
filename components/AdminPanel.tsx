
import React, { useState } from 'react';
import { CROSSWALKS_DATA } from '../constants';
import { validateSignalDataWithGemini } from '../services/geminiService';
import { CloseIcon } from './icons';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleValidate = async () => {
    setIsLoading(true);
    setAnalysisResult('');
    const result = await validateSignalDataWithGemini(CROSSWALKS_DATA);
    setAnalysisResult(result);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">관리자 패널: 신호 데이터 검증</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-gray-200">현재 데이터</h3>
            <div className="bg-gray-900 rounded-md p-3 text-sm font-mono text-gray-300 max-h-48 overflow-y-auto">
              {CROSSWALKS_DATA.map(cw => (
                <div key={cw.id}>{`ID ${cw.id}: ${cw.name} (녹:${cw.pedestrianGreenSeconds}s/적:${cw.pedestrianRedSeconds}s)`}</div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleValidate}
            disabled={isLoading}
            className="w-full bg-dnue-blue hover:bg-dnue-light-blue text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'AI 분석 중...' : 'Gemini AI로 데이터 정합성 검토'}
          </button>

          {analysisResult && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-gray-200">AI 분석 결과</h3>
              <div className="bg-gray-900 rounded-md p-4 text-gray-300 whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

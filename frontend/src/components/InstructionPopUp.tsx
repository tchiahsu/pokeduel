import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Button from './Button';
import SelectionInstruction from './TeamSelection/SelectionInstruction';

interface InstructionsPopupProps {
  onClose: () => void;
}

const InstructionsPopup: React.FC<InstructionsPopupProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'start' | 'team' | 'battle'>('start');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative flex flex-col bg-gray-300/80 rounded-xl p-8 shadow-xl w-12/13 max-w-3xl h-4/5 text-gray-700">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-700"
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2 className="text-2xl h-15 font-bold mb-4 text-center text-[#2563eb]">How to...</h2>

        {/* Tab Buttons */}
        <div className="flex h-15 justify-center gap-4 mb-6 flex-wrap">
          <Button
            onClick={() => setActiveTab('start')}
            size="sm"
            variant={activeTab === 'start' ? 'yellow' : 'blue'}
          >
            Start Game
          </Button>
          <Button
            onClick={() => setActiveTab('team')}
            size="sm"
            variant={activeTab === 'team' ? 'yellow' : 'blue'}
          >
            Build Team
          </Button>
          <Button
            onClick={() => setActiveTab('battle')}
            size="sm"
            variant={activeTab === 'battle' ? 'yellow' : 'blue'}
          >
            Battle
          </Button>
        </div>

        {/* Tab Content */}
        <div className="flex flex-1 overflow-y-auto px-1 pr-4 scroll-smooth space-y-4 text-[#2563eb]">
          {activeTab === 'start' && (
            <div className='flex flex-col gap-5'>
              <h3 className="text-lg">How to Start the Game</h3>
              <ol className="flex flex-col gap-5 list-decimal list-inside text-gray-700">
                <li>Click on <b className='bg-gray-300 p-1 rounded-lg'>Solo Battle</b> to play with Computer or click on <b className='bg-gray-300 p-1 rounded-lg'>Multiplayer</b> to battle a friend</li>
                <li>In Multiplayer, create or join a Room using BattleRoomID</li>
                <li>After joining, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START GAME</b> to proceed to Team Selection</li>
                <li>After joining, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START GAME</b> to proceed to Team Selection</li>
                <li>After joining, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START GAME</b> to proceed to Team Selection</li>
                <li>After joining, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START GAME</b> to proceed to Team Selection</li>
                <li>After joining, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START GAME</b> to proceed to Team Selection</li>
                <li>After joining, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START GAME</b> to proceed to Team Selection</li>
              </ol>
            </div>
          )}

          {activeTab === 'team' && <SelectionInstruction />}

          {activeTab === 'battle' && (
            <div className='flex flex-col gap-5'>
              <h3 className="text-lg font-semibold">How to Battle</h3>
              <ol className="flex flex-col gap-5 list-decimal list-inside text-gray-700">
                <li>Use the <b className='bg-[#FFA500] p-1 text-gray-100 rounded-lg'>ATTACK</b> button to choose a move to attack with</li>
                <li>Use <b className='bg-[#3B4CCA] p-1 text-gray-100 rounded-lg'>SWITCH</b> to change current Pokemon during battle</li>
                <li>Click <b className='bg-[#FF0000] p-1 text-gray-100 rounded-lg'>QUIT</b> to exit the battle</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructionsPopup;
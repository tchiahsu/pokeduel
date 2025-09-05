import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Button from './Button';

interface InstructionsPopupProps {
  onClose: () => void;
}

const InstructionsPopup: React.FC<InstructionsPopupProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'start' | 'team' | 'battle'>('start');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative bg-gray-300/80 rounded-xl p-8 shadow-xl w-12/13 max-w-2xl h-5/8 text-gray-700">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black"
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center text-[#2563eb]">How to...</h2>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
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
        <div className="text-left space-y-4 px-2 sm:px-6 text-[#2563eb]">
          {activeTab === 'start' && (
            <div className='flex flex-col gap-5'>
              <h3 className="text-lg">How to Start the Game</h3>
              <ol className="flex flex-col gap-5 list-decimal list-inside text-gray-700">
                <li>Click on <b className='bg-gray-300 p-1 rounded-lg'>Solo Battle</b> to play with Computer or click on <b className='bg-gray-300 p-1 rounded-lg'>Multiplayer</b> to battle a friend</li>
                <li>In Multiplayer, create or join a Room using BattleRoomID</li>
                <li>After joining, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START GAME</b> to proceed to Team Selection</li>
              </ol>
            </div>
          )}

          {activeTab === 'team' && (
            <div className='flex flex-col gap-5'>
              <h3 className="text-lg font-semibold">How to Select Team</h3>
              <ol className="flex flex-col gap-5 list-decimal list-inside text-gray-700">
                <li>Select a maximum of 6 Pokemon for your team</li>
                <li>Click on a Pokemon to view its stats and moves</li>
                <li>Add the moves and remember each Pokemon can have up to 4 moves</li>
                <li>Once your team is ready, click <b className='bg-amber-400 p-1 text-gray-100 rounded-lg'>START</b></li>
              </ol>
            </div>
          )}

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
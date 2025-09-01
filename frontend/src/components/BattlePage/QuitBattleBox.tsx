import React from 'react';
import Button from '../Button';

interface QuitBattleBox {
  onConfirm: () => void;
  onCancel: () => void;
}

const QuitBattleBox: React.FC<QuitBattleBox> = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col gap-10 bg-gray-300/80 rounded-xl p-4 shadow-lg justify-center items-center text-center w-2/3 h-1/5 max-w-2xl ease-in-out duration-200">
                <p className="text-lg font-bold">Are you sure you want to quit?</p>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={onConfirm}
                    >
                        YES
                    </Button>
                    <Button
                        onClick={onCancel}
                    >
                        NO
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuitBattleBox;


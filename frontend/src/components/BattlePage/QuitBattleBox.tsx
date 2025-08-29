import React from 'react';
import Button from '../Button';

interface QuitBattleBox {
  onConfirm: () => void;
  onCancel: () => void;
}

const QuitBattleBox: React.FC<QuitBattleBox> = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-300/80 rounded-lg p-6 shadow-lg text-center space-y-4">
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


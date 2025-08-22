import React from "react";
// import clsx from "clsx";


type IntermediateProp = {
  isVisible: boolean;
};

const IntermediatePopUp: React.FC<IntermediateProp> = ({ isVisible }) => {
    if (!isVisible) {
        return null;
    };
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-300/80 rounded-lg p-6 shadow-lg text-center">
                <p className="text-lg font-semibold text-gray-700">Waiting for opponent to start..."</p>
            </div>
        </div>
    );
};

export default IntermediatePopUp;
import React from 'react';
import Image from 'next/image';
import { Popup } from '../../components/Popup';

type Props = {
  children: React.ReactNode,
  title?: string,
  onClose: () => void,
};

export default function Window({ children, title, onClose }: Props) {
  return (
    <Popup>
      <div className="flex w-full h-full justify-center items-center">
        <div className="w-80 bg-white rounded-t-2xl rounded-b-xl">
          <div className="w-full bg-sky-400 flex items-center rounded-t-xl overflow-hidden">
            <span className="w-full flex-initial pl-2 font-bold">{title}</span>
            <button className="w-10 h-10 flex-none hover:bg-sky-500 font-bold" onClick={onClose}>X</button>
          </div>
          <div className="w-full h-full p-2">
            {children}
          </div>
        </div>
      </div>
    </Popup>
  );
};

import React from 'react';
import Image from 'next/image';

type Props = {
  children: React.ReactNode,
};

export default function Popup({ children }: Props) {
  return (
    <div className="w-full h-full bg-blacktr-1/2 fixed top-0">
      {children}
    </div>
  );
};

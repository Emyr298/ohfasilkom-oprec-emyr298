import React from 'react';
import Image from 'next/image';
import { Post } from '../../types';

type Props = {
  post: Post,
  setCurrentPostId: (id: number | null) => void,
};

export default function Thumbnail({ post, setCurrentPostId }: Props) {
  return (
    <div className="w-64 h-48 p-2 rounded-xl hover:bg-blacktr-1/10 flex flex-col cursor-pointer" onClick={() => {setCurrentPostId(post.id)}}>
      <div className="h-36 relative flex-initial rounded-xl border-2 overflow-hidden">
        <Image 
          src={post.url}
          loading='lazy'
          layout='fill'
          objectFit='cover'
        />
      </div>
      <span className="h-8 flex-initial block mt-2 text-center font-bold">{post.title}</span>
    </div>
  );
};

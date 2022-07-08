import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Post } from '../../types';
import { SearchParams } from '../../types';

type Inputs = {
  title?: string,
  category?: string,
  uploadedAt?: string,
};

type Props = {
  setSearchState: (params: SearchParams) => void,
};

export default function SearchBox({ setSearchState }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    if (data.category === 'Category') data.category = undefined;
    
    const params: SearchParams = {
      page: 1,
    };
    if (data.title) params.title = data.title;
    if (data.category) params.category = data.category;
    if (data.uploadedAt) params.uploaded_at = data.uploadedAt;
    
    setSearchState(params);
  };
  
  return (
    <form className="h-10 mx-10 mt-2 flex flex-row" onSubmit={handleSubmit(onSubmit)}>
      <input className="h-full flex-initial w-full border-2 rounded-l-xl p-2" type="text" placeholder="Title" {...register('title')} />
      <select className="h-full flex-initial w-64 border-t-2 border-b-2 border-r-2" defaultValue="Category" {...register('category')}>
        <option>Category</option>
        <option>artwork</option>
        <option>anime</option>
        <option>meme</option>
        <option>photography</option>
        <option>furry</option>
      </select>
      <input className="h-full flex-initial w-64 border-t-2 border-b-2" type="date" placeholder="Uploaded At" {...register('uploadedAt')} />
      <input className="h-full flex-initial w-64 bg-sky-400 hover:bg-sky-500 border-2 rounded-r-xl cursor-pointer" type="submit" value="Search" />
    </form>
  );
};

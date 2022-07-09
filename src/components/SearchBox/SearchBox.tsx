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
    <form className="sm:h-10 mx-10 mt-2 flex sm:flex-row flex-col" onSubmit={handleSubmit(onSubmit)}>
      <input className="sm:h-full h-10 sm:flex-initial sm:w-full border-2 sm:rounded-l-xl sm:rounded-r-none rounded-t-xl p-2" type="text" placeholder="Title" {...register('title')} />
      <select className="pl-2 sm:h-full h-10 sm:flex-initial sm:w-64 sm:border-t-2 sm:border-b-2 sm:border-r-2 sm:border-l-0 border-l-2 border-r-2 border-b-2" defaultValue="Category" {...register('category')}>
        <option>Category</option>
        <option>artwork</option>
        <option>anime</option>
        <option>meme</option>
        <option>photography</option>
        <option>furry</option>
      </select>
      <input className="pl-2 sm:h-full h-10 sm:flex-initial sm:w-64 sm:border-t-2 sm:border-l-0 sm:border-r-0 border-l-2 border-r-2 border-b-2 " type="date" placeholder="Uploaded At" {...register('uploadedAt')} />
      <input className="sm:h-full h-10 sm:flex-initial sm:w-64 bg-sky-400 hover:bg-sky-500 sm:rounded-r-xl sm:rounded-l-none rounded-b-xl cursor-pointer" type="submit" value="Search" />
    </form>
  );
}

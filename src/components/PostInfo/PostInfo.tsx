import React from 'react';
import { useForm, SubmitHandler, Validate, ValidateResult } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Post } from '../../types';

type Inputs = {
  title: string,
  category: string,
};

type Props = {
  post: Post | null,
  fetchImages: () => void,
  setCurrentPostId: (id: number | null) => void,
  setCurrentPost: (value: Post) => void,
  setPopupState: (value: string) => void,
};

export default function PostInfo({ post, fetchImages, setCurrentPostId, setCurrentPost, setPopupState }: Props) {
  const [isModifying, setIsModifying] = useState<boolean>(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!post) return;
    
    try {
      const response = await axios.patch(`https://oh-oprec-be.rorre.xyz/api/post/${post.id}`,
        {
          title: data.title,
          category: data.category,
        },
        {
          headers: {
            'Authorization': 'Bearer 0cf4653f-badb-4406-b01f-be038aa39a32',
          },
        },
      );
      
      response.data.url = 'https://oh-oprec-be.rorre.xyz' + response.data.url;
      
      setCurrentPost(response.data);
      fetchImages();
      setIsModifying(false);
    } catch(error) {
      console.log(error);
    }
  };
  
  const onDelete = async () => {
    if (!post) return;
    
    try {
      const response = await axios.delete(`https://oh-oprec-be.rorre.xyz/api/post/${post.id}`,
        {
          headers: {
            'Authorization': 'Bearer 0cf4653f-badb-4406-b01f-be038aa39a32',
          },
        },
      );
      
      fetchImages();
      setCurrentPostId(null);
      setPopupState('none');
    } catch (error) {
      console.log(error); // TODO: error message
    }
  }
  
  const validateCategoryNotEmpty: Validate<string> = function(value: string): ValidateResult {
    return value !== 'Category';
  }
  
  const errorSpan = function(message: string): JSX.Element {
    return (
      <span className="text-sm px-2 text-red-500">{message}</span>
    );
  }
  
  return (
    <>
      { post != null ?
        <>
          <div className="h-36 relative flex-initial rounded-xl border-2 overflow-hidden">
            <Image 
              src={post.url}
              loading='lazy'
              layout='fill'
              objectFit='cover'
            />
          </div>
          <span className="px-2 text-sm text-gray-600">Uploaded At: {(new Date(post.uploaded_at)).toLocaleString()}</span>
          <div className="mt-2 flex flex-row justify-end">
            { !isModifying ?
              <>
                <button className="mr-2 hover:text-red-500" onClick={onDelete}>Delete</button>
                <button className="hover:text-yellow-500" onClick={() => {setIsModifying(true)}}>Modify</button>
              </>
              :
              <>
                <button className="hover:text-red-500" onClick={() => {setIsModifying(false)}}>Cancel</button>
              </>
            }
          </div>
          { !isModifying ?
            <div className="mt-2">
              <span className="block w-full pl-2 h-8 border-2 rounded-xl">{post.title}</span>
              <span className="block w-full mt-2 pl-2 h-8 border-2 rounded-xl">{post.category}</span>
            </div>
            :
            <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
              <input className="block w-full pl-2 h-8 border-2 rounded-xl" type="text" placeholder="Title" defaultValue={post.title} {...register('title', { required: true, maxLength: 64 })} />
              { errors.title && errors.title.type === 'required' &&
                <>
                  {errorSpan('this field must be filled')}
                </>
              }
              { errors.title && errors.title.type === 'maxLength' &&
                <>
                  {errorSpan('number of characters exceeds 64')}
                </>
              }
              <select className="block w-full mt-2 pl-1 h-8 border-2 rounded-xl" defaultValue={post.category} {...register('category', { validate: validateCategoryNotEmpty })}>
                <option>Category</option>
                <option>artwork</option>
                <option>anime</option>
                <option>meme</option>
                <option>photography</option>
                <option>furry</option>
              </select>
              { errors.category &&
                <>
                  {errorSpan('this field must be filled')}
                </>
              }
              <input className="block w-full h-8 mt-2 bg-sky-400 hover:bg-sky-500 rounded-xl cursor-pointer" type="submit" value="Save" />
            </form>
          }
        </>
        :
        <span>Post not found</span>
      }
    </>
  );
};

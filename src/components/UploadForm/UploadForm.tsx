import React from 'react';
import { useForm, SubmitHandler, Validate, ValidateResult } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

// References:
// https://stackoverflow.com/questions/572768/styling-an-input-type-file-button

type Inputs = {
  title: string,
  category: string,
  imageFile: File[],
  image?: string,
};

type Props = {
  fetchImages: () => void,
  setPopupState: (value: string) => void,
};

export default function UploadForm({ fetchImages, setPopupState }: Props) {
  const [fileName, setFileName] = useState<string>('No file choosen');
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('image', data.imageFile[0]);
    
    try {
      const response = await axios.post('https://oh-oprec-be.rorre.xyz/api/post/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer 0cf4653f-badb-4406-b01f-be038aa39a32',
          },
      });
      
      fetchImages();
      setPopupState('none');
    } catch(error) {
      setUploadErrorMessage('error: couldn\'t connect to the server');
    }
  };
  
  const handleFileChange = function(event: React.ChangeEvent<HTMLInputElement>): void {
    const files: FileList | null = event.target.files;
    
    if (!files || !files[0]) {
      setFileName('No file choosen');
      return;
    }
    
    setFileName(files[0].name);
  }
  
  const validateCategoryNotEmpty: Validate<string> = function(value: string): ValidateResult {
    return value !== 'Category';
  }
  
  const validateFileIsImage: Validate<File[]> = function(files: File[]): ValidateResult {
    const file: File = files[0];
    return ['image/png', 'image/jpeg'].includes(file.type);
  }
  
  const errorSpan = function(message: string): JSX.Element {
    return (
      <span className="text-sm px-2 text-red-500">{message}</span>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input className="block w-full pl-2 h-8 border-2 rounded-xl" type="text" placeholder="Title" {...register('title', { required: true, maxLength: 64 })} />
      { errors.title && errors.title.type === 'required' &&
        <>
          {errorSpan('this field must be filled')}
        </>
      }
      {errors.title && errors.title.type === 'maxLength' &&
        <>
          {errorSpan('number of characters exceeds 64')}
        </>
      }
      <select className="block w-full mt-2 pl-2 h-8 border-2 rounded-xl" defaultValue="Category" {...register('category', { validate: validateCategoryNotEmpty })}>
        <option>Category</option>
        <option>artwork</option>
        <option>anime</option>
        <option>meme</option>
        <option>photography</option>
        <option>furry</option>
      </select>
      {errors.category &&
        <>
          {errorSpan('this field must be filled')}
        </>
      }
      <div className="w-full mt-2 flex flex-row">
        <label className="flex-initial w-28 h-8 leading-7 text-center bg-sky-400 hover:bg-sky-500 rounded-l-xl cursor-pointer" htmlFor="image-file">Browse</label>
        <label className="flex-initial w-full h-8 px-2 leading-7 border-2 rounded-r-xl overflow-hidden">{fileName}</label>
        <input className="hidden" id="image-file" type="file" accept="image/png, image/jpeg" {...register('imageFile', { required: true, onChange: handleFileChange, validate: validateFileIsImage })} />
      </div>
      {errors.imageFile &&
        <>
          {errorSpan('the file must be a JPEG or PNG file')}
        </>
      }
      <input className="block w-full h-8 mt-2 bg-sky-400 hover:bg-sky-500 rounded-xl cursor-pointer" type="submit" value="Upload" />
      {uploadErrorMessage &&
        <>
          {errorSpan(uploadErrorMessage)}
        </>
      }
    </form>
  );
};

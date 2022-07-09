import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { SearchBox } from '../components/SearchBox';
import { Post } from '../types';
import { Thumbnail } from '../components/Thumbnail';
import { Window } from '../components/Window';
import { UploadForm } from '../components/UploadForm';
import { GetServerSideProps } from 'next';
import { SearchParams } from '../types/SeachParams';
import axios from 'axios';
import { PostInfo } from '../components/PostInfo';

const Home: NextPage = () => {
  const [searchState, setSearchState] = useState<SearchParams>({ page: 1 });
  const [postList, setPostList] = useState<Post[]>([]);
  const [popupState, setPopupState] = useState<string>('none'); // none, upload, post
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
  const [postErrorMessage, setPostErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  useEffect(() => {
    fetchImages();
  }, [searchState]);
  
  useEffect(() => {
    fetchPost();
    if (currentPostId != null) setPopupState('post');
  }, [currentPostId]);
  
  const fetchImages = async function(): Promise<void> {
    try {
      const response = await axios.get('https://oh-oprec-be.rorre.xyz/api/post/', {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer 0cf4653f-badb-4406-b01f-be038aa39a32',
        },
        params: searchState,
      });
      console.log('fetched');
      
      const data = response.data.map((value: Post) => {
        value.url = 'https://oh-oprec-be.rorre.xyz' + value.url;
        return value;
      });
      
      setFetchErrorMessage(null);
      setPostList(data);
    } catch (error) {
      setFetchErrorMessage('error: couldn\'t connect to the server');
      setPostList([]);
    }
  }
  
  const fetchPost = async function(): Promise<void> {
    if (!currentPostId) {
      setCurrentPost(null);
      return;
    }
    
    try {
      const response = await axios.get(`https://oh-oprec-be.rorre.xyz/api/post/${currentPostId}`, {
        headers: {
          'Authorization': 'Bearer 0cf4653f-badb-4406-b01f-be038aa39a32',
        },
      });
      console.log('fetched post');
      
      response.data.url = 'https://oh-oprec-be.rorre.xyz' + response.data.url;
      
      setPostErrorMessage(null);
      setCurrentPost(response.data);
    } catch (error) {
      setPostErrorMessage('error: couldn\'t connect to the server');
      setCurrentPost(null);
    }
  }
  
  const mapPostList = function(): JSX.Element[] {
    return postList.map((data: Post) => <Thumbnail post={data} setCurrentPostId={setCurrentPostId} key={data.id} />);
  }
  
  const handlePageClick = function(diff: number): void {
    const newSearchState: SearchParams = {...searchState};
    newSearchState.page += diff;
    setSearchState(newSearchState);
  }
  
  return (
    <>
      <Head>
        <title>Oprec Open House</title>
      </Head>
      <h1 className="text-3xl mt-2 text-center font-bold">Oprec Open House</h1>
      <SearchBox setSearchState={setSearchState} />
      <div className="h-10 mx-10 mt-2 block">
        <button className="w-full h-full bg-sky-400 hover:bg-sky-500 rounded-xl" onClick={() => {setPopupState('upload')}}>Upload</button>
      </div>
      <div className="mt-2 mb-2 flex flex-row flex-wrap flex-none justify-center">
        {fetchErrorMessage &&
          <span className="text-xl text-red-500">{fetchErrorMessage}</span>
        }
        {!fetchErrorMessage && postList.length === 0 &&
          <span className="text-xl text-gray-500">No image available</span>
        }
        {!fetchErrorMessage && postList.length > 0 &&
          <>{mapPostList()}</>
        }
      </div>
      <div className="mb-2 flex items-center justify-center">
        { searchState.page > 1 ?
          <button className="w-10 h-10 bg-sky-400 hover:bg-sky-500 rounded-xl font-bold text-white" onClick={() => {handlePageClick(-1)}}>{'<'}</button>
          :
          <div className="inline-block w-10 h-10"></div>
        }
        <span className="w-10 h-10 text-center leading-10">{searchState.page}</span>
        { postList.length === 20 ?
          <button className="w-10 h-10 bg-sky-400 hover:bg-sky-500 rounded-xl font-bold text-white" onClick={() => {handlePageClick(1)}}>{'>'}</button>
          :
          <div className="inline-block w-10 h-10"></div>
        }
      </div>
      { popupState === 'upload' &&
        <Window title="Upload" onClose={() => {setPopupState('none')}}>
          <UploadForm fetchImages={fetchImages} setPopupState={setPopupState} />
        </Window>
      }
      { popupState === 'post' &&
        <Window title="Post" onClose={() => {
          setPostErrorMessage(null);
          setCurrentPostId(null);
          setPopupState('none');
        }}>
          {postErrorMessage ?
            <span className="block text-red-500 text-sm text-center">{postErrorMessage}</span>
            :
            <PostInfo
              post={currentPost}
              setPopupState={setPopupState}
              setCurrentPost={setCurrentPost}
              setCurrentPostId={setCurrentPostId}
              fetchImages={fetchImages}
            />
          }
        </Window>
      }
    </>
  );
}

export default Home

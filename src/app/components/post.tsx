"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import Image from "next/image";

const Post = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [images, setImages] = useState([]); // new state variable to hold images
  const [files, setFiles] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetch(`/api/screenshot?searchQuery=${query}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // Set the images state variable to the list of filenames from the API
      // setImages(data.fileNames);
      setFiles(data.files);

      // Here you might want to do something with the response...
      // For instance, you can display the result (data) on the page
    } catch (error) {
      setIsError(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="flex  gap-x-4 max-w-5xl mx-auto" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="ホワイトニング 自宅"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          required
          className=""
        />
        <Button type="submit" disabled={isLoading} variant="default">
          {isLoading ? "Loading..." : "Search"}
        </Button>
      </form>
      {isError && <p>Something went wrong...</p>}
      {/* {files.length > 0 && <Separator className="my-8" />} */}
      <Separator className="my-8" />
      {/* Display the images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* {files.map((file, index) => (
                  <div key={index} className="rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="overflow-hidden w-full">
                <a
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap block w-full mb-1"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
               {file.url}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
               {file.url}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Image
            width={200}
            height={200}
            className="w-full object-cover object-center"
            src={`/img/${file.fileName}`}
              alt={`Screenshot ${index + 1}`}
          />
          <a
            className="block text-right mt-1"
            href={file.url}
            download
          >
            <Button size={"sm"} variant={"ghost"}>
              ダウンロード
            </Button>
          </a>
        </div>
        ))} */}
        <div key="" className="rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="overflow-hidden w-full">
                <a
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap block w-full mb-1"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Image
            width={200}
            height={200}
            className="w-full object-cover object-center"
            src={`/img/https___hikkoshizamurai_jp_useful_baggage_refrigerator_.png`}
            alt=""
          />
          <a
            className="block text-right mt-1"
            href="/img/https___www_roomselect_jp_info_detail_0055_.png"
            download
          >
            <Button size={"sm"} variant={"ghost"}>
              ダウンロード
            </Button>
          </a>
        </div>
        <div key="" className="rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="overflow-hidden w-full">
                <a
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap block w-full mb-1"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Image
            width={200}
            height={200}
            className="w-full object-cover object-center"
            src={`/img/https___www_roomselect_jp_info_detail_0055_.png`}
            alt=""
          />
          <a
            className="block text-right mt-1"
            href="/img/https___www_roomselect_jp_info_detail_0055_.png"
            download
          >
            <Button size={"sm"} variant={"ghost"}>
              ダウンロード
            </Button>
          </a>
        </div>
        <div key="" className="rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="overflow-hidden w-full">
                <a
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap block w-full mb-1"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Image
            width={200}
            height={200}
            className="w-full object-cover object-center"
            src={`/img/https___hikkoshizamurai_jp_useful_baggage_refrigerator_.png`}
            alt=""
          />
          <a
            className="block text-right mt-1"
            href="/img/https___www_roomselect_jp_info_detail_0055_.png"
            download
          >
            <Button size={"sm"} variant={"ghost"}>
              ダウンロード
            </Button>
          </a>
        </div>
        <div key="" className="rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="overflow-hidden w-full">
                <a
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap block w-full mb-1"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Image
            width={200}
            height={200}
            className="w-full object-cover object-center"
            src={`/img/https___www_roomselect_jp_info_detail_0055_.png`}
            alt=""
          />
          <a
            className="block text-right mt-1"
            href="/img/https___www_roomselect_jp_info_detail_0055_.png"
            download
          >
            <Button size={"sm"} variant={"ghost"}>
              ダウンロード
            </Button>
          </a>
        </div>
        <div key="" className="rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="overflow-hidden w-full">
                <a
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap block w-full mb-1"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Image
            width={200}
            height={200}
            className="w-full object-cover object-center"
            src={`/img/https___hikkoshizamurai_jp_useful_baggage_refrigerator_.png`}
            alt=""
          />
          <a
            className="block text-right mt-1"
            href="/img/https___www_roomselect_jp_info_detail_0055_.png"
            download
          >
            <Button size={"sm"} variant={"ghost"}>
              ダウンロード
            </Button>
          </a>
        </div>
        <div key="" className="rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="overflow-hidden w-full">
                <a
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap block w-full mb-1"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  https://wwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfewwwsadfasfe
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Image
            width={200}
            height={200}
            className="w-full object-cover object-center"
            src={`/img/https___www_roomselect_jp_info_detail_0055_.png`}
            alt=""
          />
          <a
            className="block text-right mt-1"
            href="/img/https___www_roomselect_jp_info_detail_0055_.png"
            download
          >
            <Button size={"sm"} variant={"ghost"}>
              ダウンロード
            </Button>
          </a>
        </div>
      </div>
    </>
  );
};

export default Post;

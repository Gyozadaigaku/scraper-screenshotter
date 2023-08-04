'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/use-toast'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'

type FormData = z.infer<typeof PostValidator>

const Post = () => {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      searchQuery: '',
    },
  })
  const queryClient = useQueryClient()

  const {
    mutate: createPost,
    isLoading,
    isError,
    data,
  } = useMutation({
    mutationFn: async ({ searchQuery }: PostCreationRequest) => {
      const { data } = await axios.get(`/api/screenshot?searchQuery=${searchQuery}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'API の呼び出しに失敗しました。',
        description: '時間をおいてから再度お試しください。',
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['screenshot', data.searchQuery], data.files)
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('aaaa')
    console.log(data)

    createPost(data)
  }

  return (
    <>
      <form className='flex gap-x-4 max-w-5xl mx-auto' onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('searchQuery', { required: true })}
          type='text'
          placeholder='ホワイトニング 自宅'
          required
          className=''
        />
        <Button type='submit' disabled={isLoading} variant='default'>
          {isLoading ? 'Loading...' : 'Search'}
        </Button>
      </form>
      <Separator className='my-8' />
      {/* Display the images */}
      <div className='grid gap-[30px] grid-cols-[repeat(auto-fit,200px)] grid-flow-row-dense  justify-center'>
        {data?.files.map((file, index) => (
          <div
            key={index}
            className='relative flex flex-col justify-start box-border col-start-auto row-start-auto bg-center cursor-pointer'
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className='overflow-hidden w-full'>
                  <a
                    className='hover:text-white overflow-ellipsis overflow-hidden text-muted-foreground whitespace-nowrap block w-full mb-1'
                    href={file.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {file.url}
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{file.url}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Image
              width={200}
              height={200}
              className='w-full object-cover object-center'
              src={`data:image/png;base64,${file.fileName}`}
              alt={`Screenshot ${index + 1}`}
            />
            <a
              className='block text-right mt-1'
              href={`data:image/png;base64,${file.fileName}`}
              download
            >
              <Button size={'sm'} variant={'ghost'}>
                ダウンロード
              </Button>
            </a>
          </div>
        ))}
      </div>
    </>
  )
}

export default Post

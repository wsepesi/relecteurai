// import type { NextApiRequest, NextApiResponse } from 'next'

import { NextRequest } from 'next/server'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prompt } from '@/lib/oai-util'
import getOAIResponse from '@/lib/oai-util'

export type Data = {
  edited: string
}

// type ReqData = {
//   body: Prompt
// }

export const config = {
  runtime: 'edge',
}

export default async function handler(
  req: NextRequest
) {
  // const prompt = req.body.params.prompt
  console.log(req.url)
  console.log(new URL(req.url))
  const { searchParams } = new URL(req.url)
  // console.log
  console.log(searchParams)
  const prompt = searchParams.get('prompt')

  if (prompt === undefined || prompt === null) {
    return new Response(
      JSON.stringify({ edited: 'ERROR' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    // res.status(400).json({ edited: 'ERROR' })
  }
  else {
    try {
      const response = await getOAIResponse(prompt)
      if (response === undefined) {
        // res.status(401).json({ edited: 'ERROR' })
        return new Response(
          JSON.stringify({ edited: 'ERROR' }),
          {
            status: 402,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
      else {
        // res.status(200).json({ edited: response})
        return new Response(
          JSON.stringify({ edited: response }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },  
          }
        )
      }
    }
    catch (e: any) {
      // log error to server
      console.log(e)
      return new Response(
        JSON.stringify({ edited: 'ERROR' }),
        {
          status: 407,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      // res.status(400).json({ edited: e.message })
    }
  }
}
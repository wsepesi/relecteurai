import type { NextApiRequest, NextApiResponse } from 'next'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prompt } from '@/lib/oai-util'
import getOAIResponse from '@/lib/oai-util'

export type Data = {
  edited: string
}

type ReqData = {
  body: Prompt
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prompt = req.body.params.prompt

  if (prompt === undefined) {
    res.status(400).json({ edited: 'ERROR' })
  }
  else {
    try {
      const response = await getOAIResponse(prompt)
      if (response === undefined) {
        res.status(401).json({ edited: 'ERROR' })
      }
      else {
        res.status(200).json({ edited: response})
      }
    }
    catch (e: any) {
      // log error to server
      console.log(e)
      res.status(400).json({ edited: e.message })
    }
   
  }
}
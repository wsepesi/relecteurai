import { Button, TextField, Typography } from '@mui/material'
import axios, { AxiosResponse } from 'axios'
import getOAIResponse, { estimateCost } from '../lib/oai-util'
import { useEffect, useState } from 'react'

import { Data } from './api/oai'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [cost, setCost] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const useOAI = async () => {
    // hit 'api/oai' endpoint with axios, and store results in data
    try {
      const { data } = await axios.post<Data>('/api/oai', {
        params: {
          prompt: input
        }
      })
      setOutput(data.edited)
    } catch (err: any) {
      console.log(err.response.data)
      alert('Error: ' + err)
    }
  }

  useEffect(() => {
    estimateCost(input).then(setCost);
  }, [input]);
  
  return (
    <>
      <Head>
        <title>Email Editor</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Typography variant="h1">Email Editor</Typography>
        <div className={styles.inputs}>
          <div>
            <TextField 
              id="outlined-basic" 
              label="Input" 
              variant="outlined" 
              className={styles.input} 
              multiline 
              value={input} 
              onChange={handleChange}
            />
            <Button onClick={useOAI}>Edit</Button>
          </div>
          <div>
            <TextField 
              disabled 
              id="outlined-basic" 
              label="Output" 
              variant="outlined" 
              className={styles.input} 
              multiline 
              value={output}
            />
            <Typography variant="h6">Estimated Cost: {cost}</Typography>
          </div>
        </div>
      </main>
    </>
  )
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { execFile, exec, execSync } from "child_process";
import path from 'path';
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import { coderun } from '@/utilities/coderun';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const requestId = uuidv4();

  const { language, code } = req.body;

  console.log(code);

  try{
    const output = await coderun(language, code);
    return res.status(200).json({message: output});
  }
  catch(error: any){
    return res.status(500).json({ message: error.message });
  }

}
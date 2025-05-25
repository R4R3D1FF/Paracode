import { execFile, exec, execSync } from "child_process";
import path from 'path';
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function coderun(language: string, code: string, requestId: string = ""){
  if (requestId === "")
    requestId = uuidv4();
  if (language === "cpp"){

    const bashCommand = `\
      mkdir -p /home/codes /home/executables && \
      g++ /home/codes/temp.cpp -o /home/executables/temp.exe && \
      /home/executables/temp.exe \
    `;
    
    const directoryPath = path.join(process.cwd(), `temp-${requestId}`);
    const filePath = path.join(process.cwd(), `temp-${requestId}`, `temp.cpp`);
    

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, code);
    
    
    
    try{
        const output = execSync(
        `docker run --rm -v ${directoryPath}:/home/codes/ gcc bash -c "${bashCommand}"`,
        { encoding: 'utf-8' });
        fs.rmSync(directoryPath, { recursive: true, force: true });
        
        return output;
        
    }
    catch(error){
        fs.rmSync(directoryPath, { recursive: true, force: true });
        throw error;
    }

    
  }

  else if (language === "c"){

    const bashCommand = `\
      mkdir -p /home/codes /home/executables && \
      gcc /home/codes/temp.c -o /home/executables/temp.exe && \
      /home/executables/temp.exe \
    `;
    
    const directoryPath = path.join(process.cwd(), `temp-${requestId}`);
    const filePath = path.join(process.cwd(), `temp-${requestId}`, `temp.c`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, code);
    
    


    try{
        const output = execSync(
        `docker run --rm -v ${directoryPath}:/home/codes/ gcc bash -c "${bashCommand}"`,
        { encoding: 'utf-8' });

        fs.rmSync(directoryPath, { recursive: true, force: true });
        return output;
        
    }
    catch(error){
        throw error;
    }


    
  }

  else if (language === "python"){
    
    const bashCommand = `\
      mkdir -p /home/codes /home/executables && \
      py /home/codes/temp.py \
    `;
    
    const directoryPath = path.join(process.cwd(), `temp-${requestId}`);
    const filePath = path.join(process.cwd(), `temp-${requestId}`, `temp.py`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, code);
    
    


    exec(
      `docker run --rm -v ${directoryPath}:/home/codes/ python bash -c "${bashCommand}"`,
      { encoding: 'utf-8' },
      (error, stdout, stderr) => {
        if (error) {
          throw new Error(stderr || error.message);
        }
        console.log(stderr);

        fs.rmSync(directoryPath, { recursive: true, force: true });
        return stdout;
      }
    );
    
    

  }

  else if (language == "java"){
    const bashCommand = `\
      mkdir -p /home/codes /home/executables && \
      javac -d /home/executables/temp.class /home/codes/temp.java && \
      java /home/codes/temp.java \
    `;
    
    const directoryPath = path.join(process.cwd(), `temp-${requestId}`);
    const filePath = path.join(process.cwd(), `temp-${requestId}`, `temp.java`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, code);
    
    


    exec(
      `docker run --rm -v ${directoryPath}:/home/codes/ openjdk bash -c "${bashCommand}"`,
      { encoding: 'utf-8' },
      (error, stdout, stderr) => {
        fs.rmSync(directoryPath, { recursive: true, force: true });
        if (error) {
          throw new Error(stderr || error.message);
        }
        console.log(stderr);

        return stdout;
      }
    );
  }

  else
    throw new Error("Language not supported");
}

export async function coderunFromId(language: string, code: string, problem_id: number = -1){

  
  console.log(code);
  
  
  if (problem_id != -1){

    const problem = await prisma.problem.findUnique({
        where: {
            id: problem_id,
        },
    });
    const testcases = problem?.testcases;

    console.log(testcases);

    try{
      if (testcases){
        return await coderunTests(language, code, testcases);
      }
      else
        throw new Error("Testcases undefined.\n");
    }

    catch(error:any){
      throw error;
    }
  }
  

  
}


export async function coderunTests(language: string, code: string, testcases: string){
  const requestId = uuidv4();

  
  console.log(code);
  
  


  const testFilePath = path.join(process.cwd(), `temp-${requestId}`, `temp.csv`);

  fs.mkdirSync(path.dirname(testFilePath), { recursive: true });

  fs.writeFileSync(testFilePath, testcases);
  
  

  try{
    const resp = await coderun(language, code, requestId);
    console.log("coderunTests: ", resp);
    return resp;
  }
  catch (error){
    throw error;
  }
}
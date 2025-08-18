import { v4 as uuidv4 } from 'uuid';

export default function coderunComp(language: string, userCode: string, targetCode: string) {
    const requestId = uuidv4();
    if (language === "cpp") {
        
        const bashCommand = `\
            mkdir -p /home/codes /home/executables && \
            g++ /home/codes/temp.cpp -o /home/executables/temp.exe && \
            /home/executables/temp.exe \
        `;
    }
}
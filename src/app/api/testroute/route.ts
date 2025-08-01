import { NextApiRequest, NextApiResponse } from "next";
import { coderun } from "@/utilities/coderun";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    try{
        const output = await coderun("c", "#include <stdio.h>\nint main(){\n\tprintf(\"HELLO WORLD\");\nreturn 0;\n}");
        console.log(output);
        res.status(200).json({"msg": output});
    }
    catch(err){
        console.log(err);
        res.status(500).json({"err": err});
    }
    
}
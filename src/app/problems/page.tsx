import Link from "next/link";

export default async function(){
    const problems = await fetch(`${process.env.API_BASE_URL}/problems`)
        .then(res => res.json());


    return (
        <>
            <ul className="flex flex-col gap-1">
                {
                    problems.map((problem: any, i: number) => (
                        <Link key={i} className="border-b border-gray-400 flex justify-between gap-1 bg-blue-50 rounded-sm" href={`/problem/${problem.id}/`}>
                            <div className="w-1/3 bg-blue-100 py-2 px-4 text-center"> {i+1} </div>
                            <div className="w-1/3 bg-blue-100 py-2 px-4 text-center"> {problem.title} </div>
                            
                            <div className="w-1/3 bg-blue-100 py-2 px-4 text-center"> {problem.difficulty} </div>
                        </Link>
                    ))
                }
            </ul>
            {/* {problems.toString()} */}
        </>
    )
}
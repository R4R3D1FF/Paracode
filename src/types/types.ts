export type TestcaseVerdict = {
    testcase: string,
    passed: boolean,
    output?: string,
    target?: string,
    timeout: boolean,
    runtime? : number
};

export type TestcaseVerdict = {
    testcase: string,
    passed: boolean,
    timeout: boolean,
    runtime? : number
};

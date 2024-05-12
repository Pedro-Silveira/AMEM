export default function testRegex(regex: any, test: any){
    const newTest = new RegExp(regex);

    return newTest.test(test);
}
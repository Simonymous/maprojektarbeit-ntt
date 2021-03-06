    /**
     * Basic getOpenTests For Plugin
     *
     * @param data dataForPlugin from Task
     * @param tests open tests for task
     * @param input userInput
     * @returns Return obj to Frontend Plugin
     */
    function getOpenTests(data:any,tests:any,input:any):any {
        const userinput = input.defaultCode
        return codingTests(data.inputParams,tests,userinput)
    }

    /**
     * Basic getOpenTests For Plugin
     *
     * @param data dataForPlugin from Task
     * @param tests closed tests for task
     * @param input userInput
     * @returns a note 0-100 for evaluation
     */
    function submit(data:any,tests:any,input:any):number {
        const userinput = input.defaultCode
        return getNote(data.inputParams,tests,userinput)
    }

    import { ITestResult, IFeedback } from './codingPluginInterfaces'

    /**
     *
     * @param inputparams inputparams (stored in dataforplugin)
     * @param tests open Tests created
     * @param userInput userInput to test
     * @returns Feedback in IFeedback Format (Message + runned Test Feedback)
     */
    function codingTests(inputparams:string[],tests:any[],userInput:string):IFeedback  {
        let returnTests = []
        let message = ""
        let countPassed = 0
        try {
          userInput = getBody(userInput)
          var safeEval = require('notevil')
          let userFunction = safeEval.Function(...inputparams,userInput)
          tests.forEach(openTest => {
            let testInput = JSON.parse(openTest.input)
            let expectedOutput = JSON.parse(openTest.output)
            let currentoutput = userFunction.apply('sandbox',testInput)
            let testDescription = "EXPECT "+JSON.stringify(testInput)+" TO BE "+JSON.stringify(expectedOutput)+"-> GETTING "+JSON.stringify(currentoutput)
            let testResult:ITestResult
            if(currentoutput===expectedOutput) {
                testResult = {passed:true,message:testDescription}
                countPassed++
            } else {
                testResult = {passed:false,message:testDescription}
            }
            returnTests.push(testResult)
          })
          message = countPassed+"/"+tests.length+" PASSED"
        } catch(e) {
            message = "Compile Error: "+e.message
        }
        const returnObj:IFeedback = {
            message: message,
            testResults: returnTests
        }

        return returnObj
      }

    /**
     *
     * @param inputparams inputparams (stored in dataforplugin)
     * @param tests closed Tests created
     * @param userInput userInput to test
     * @returns Note Number 0-100 for evaluation
     */
    function getNote(inputparams:string[],tests:any[],userInput:string) {
        let countPassed = 0
        try {
            userInput = getBody(userInput)
            var safeEval = require('notevil')
            let userFunction = safeEval.Function(...inputparams,userInput)

            tests.forEach(openTest => {
              let testInput = JSON.parse(openTest.input)
              let expectedOutput = JSON.parse(openTest.output)
              let currentoutput = userFunction.apply('sandbox',testInput)
              if(currentoutput===expectedOutput) {
                  countPassed++
              }
            })
          } catch(e) {
              //console.log("Funktion konnte nicht erzeugt werden",e)
        }
        return countPassed/tests.length * 100
    }

    const getBody = (string) => string.substring(string.indexOf("{") + 1,string.lastIndexOf("}"))

export default { getOpenTests,submit }


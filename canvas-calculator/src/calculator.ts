const operators : ReadonlyArray<string> = ['+', '-', '*', '/','\u00D7', '\u00F7'] as const
type Operator = (typeof operators)[number]

const lBrack : ReadonlyArray<string> = ['(','[','{'] as const

// Checks if a value is an operator
function isOperator(c:any) : c is Operator {
    return (typeof c) === 'string' && operators.includes(c)
}

// Gives operator precedence a integer value
function checkPrec(op:Operator | string) : number {
    switch (op){
        default:
            return -1
        case '+':
        case '-':
            return 1
        case '*': case '\u00D7':
        case '/': case '\u00F7':
            return 2 
    }
}

// Checks if the brackets are balanced
// Complexity: O(n)
function isBalancedBracket(infix:string) : boolean {
    const brack : {[id:string]:string} = {'(':')','[':']','{':'}'} as const
    const stack : Array<string> = []
    infix.split('').forEach(char => {
        if (lBrack.includes(char)){
            stack.push(char)
        }
        else if (char === brack[stack.slice(-1)[0]]) {
            stack.pop()
        }
        else if ([')',']','}'].includes(char)){
            return false
        }
    })
    if (stack.length === 0) {
        return true
    }
    return false
}

// Removes +-, -+, ++, -- as to create a binary function
// Compexity: O(n+m) where m is matching substrings
function formatNegatives(infix:string) : string {
    return infix.replace(/\-\-|\+\+/g,'+')
                .replace(/\+\-|\-\+/g,'+0-')
}

function isOperand(c:any) : boolean {
    return (typeof c === 'string') && (!lBrack.includes(c) || !isOperator(c))
}

// Convert infix expression to postfix expression
// Complexity: O(n)
function toPostfix(infix:string) : string {
    const stack : Array<string> = []
    let postfix = ''
    infix.replace(/(\-|\+|\*|\/|\^|\(|\))/g, ' $1 ')
        .replace(/\s\s+/g, ' ').replace(/^\s|\s$/g, '').split(' ').forEach(char => {
        // Cases where char is a bracket
        console.log(char)
        if (lBrack.includes(char)){
            stack.push(char)
        }
        else if ([')',']','}'].includes(char)){
            while (!lBrack.includes(stack.slice(-1)[0])){
                postfix += ' ' + stack.pop()
            }
            stack.pop()
        } 

        // Cases where char is a operand
        else if (!isOperator(char)){
            // if ((isOperator(postfix.slice(-1))) ?? false ) {
            //     postfix += ' '
            // }
            postfix += ' ' + char
        }

        // Handle cases where char is an operator
        else {
            // If precedence of current operator is lesser 
            while (stack.length && checkPrec(char) <= checkPrec(stack.slice(-1)[0])){
                postfix += ' ' + stack.pop()
            }
            // Push Operator onto stack
            stack.push(char)
        }
    })

    // Put remaining operators into equayion
    while (stack.length > 0){
        // if ((isOperator(stack.slice(-1)[0])) ?? false ) {
        //     postfix += ' '
        // }
        postfix += ' ' + stack.pop()
    }

    return postfix.slice(1)
}

function evalTerm(op:Operator, x:number, y:number) : number {
    switch (op){
        case '+': return x + y
        case '-': return x - y
        case '*': case '\u00D7': return x * y
        case '/': case '\u00F7': return x / y
        case '^': return x ** y
        case 'root': return Math.pow(y,1/x)
        default: return NaN
    }
}

// Convert postfix expression to expression tree
// Complexity: O(n)
function evalPostfix(postfix:string) : number {
    const stack : Array<number> = []
    postfix.split(' ').forEach(char => {
        if (!isOperator(char)){
            stack.push(Number(char))
        }
        else {
            const right = stack.pop() ?? NaN
            const left = stack.pop() ?? NaN
            stack.push(evalTerm(char, left, right))
        }
    });
    return stack.pop() ?? NaN
}

// Parse and evaluate a string representing an equation
// Complexity: O(n)
function parseEval(data:string) : string {
    return String(isBalancedBracket(data) ?  evalPostfix(
                toPostfix(
                formatNegatives(
                data.replace(' ',''))))
                : NaN
                )
}

export default parseEval

/*
Infix to Postfix:
https://iq.opengenus.org/infix-to-postfix-expression-stack/
*/
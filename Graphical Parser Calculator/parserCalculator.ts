const operators : ReadonlyArray<string> = ['+', '-', '*', '/','^','rad'] as const
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
        case '*':
        case '/':
            return 2
        case '^':
        case 'rad':
            return 3
    }
}

// Checks if the brackets are balanced
// Complexity: O(n)
function isBalancedBracket(infix:string) : boolean {
    const brack = {'(':')','[':']','{':'}'} as const
    const stack : Array<string> = []
    infix.split('').forEach(char => {
        if (lBrack.includes(char)){
            stack.push(char)
        }
        else if (char === brack[stack.slice(-1)[0]]) {
            stack.pop()
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
    return infix.replace('/--|\+\+/g','+')
                .replace('/\+-|-\+/g','+0-')
}

// Convert infix expression to postfix expression
// Complexity: O(n)
function toPostfix(infix:string) : string {
    const stack : Array<string> = []
    let postfix = ''

    infix.split('').forEach(char => {
        if (lBrack.includes(char)){
            stack.push(char)
        }
        else if ([')',']','}'].includes(char)){
            while (!lBrack.includes(stack.slice(-1)[0])){
                postfix += stack.pop()
            }
            stack.pop()
        } 
        else if (!isOperator(char)){
            postfix += char
        }

        else {
            // If precedence of current operator is lesser 
            while (stack.length && checkPrec(char) <= checkPrec(stack.slice(-1)[0])){
                postfix += stack.pop()
            }
            // Push Operator onto stack
            stack.push(char)
        }
    })

    // Put remaining operators into equayion
    while (stack.length > 0){
        postfix += stack.pop()
    }

    return postfix
}

function evalTerm(op:Operator, x:number, y:number) : number {
    switch (op){
        case '+': return x + y
        case '-': return x - y
        case '*': return x * y
        case '/': return x / y
        default: return NaN
    }
}

// Convert postfix expression to expression tree
// Complexity: O(n)
function evalPostfix(postfix:string) : number {
    const stack : Array<number> = []
    postfix.split('').forEach(char => {
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
export default function parseEval(data:string) : string {
    return String(isBalancedBracket(data) ?  evalPostfix(
                toPostfix(
                formatNegatives(
                data.replace(' ',''))))
                : NaN
                )
}

/*
Infix to Postfix:
https://iq.opengenus.org/infix-to-postfix-expression-stack/

Expression tree:
https://www.baeldung.com/cs/postfix-expressions-and-expression-trees
*/
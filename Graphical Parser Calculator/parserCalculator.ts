type operator = '+' | '-' | '*' | '/'
interface exprTree {
    data: operator | number
    leftNode: exprTree | null
    rightNode: exprTree | null,
}

function toInfix(){

}

function toPostfix(){
    
}

function parseExprTree(infix:string) : exprTree {
    const expr : exprTree = {data: 4, leftNode: null, rightNode: null}
    return expr
}

function evalExprTree(tree:exprTree) : number {
    return 0
}

export default function parseEval(data:string) : string {
    return data
}
// Takes Array of button values and puts them on a grid
function graphicCalculator(buttons:Array<string>){
    const grid = document.getElementById('grid')

    // Generate Button Element
    buttons.forEach(button => {
        const btn = document.createElement('button')
        btn.textContent = button
        btn.onclick = () => inputChar(button)
        btn.classList.add('grid-button')
        if (button === '='){
            btn.classList.add('grid-button-equals')
        }
        grid?.appendChild(btn)
    })
}

// Onclick input action
function inputChar(button:string){
    const display = document.getElementById('display') as HTMLInputElement
    const subDisplay = document.getElementById('sub-display') as HTMLInputElement

    // Evaluate Expression
    if (button === '='){
        if (!!subDisplay.innerHTML) {
            display.innerHTML = String(evalExpr(display.innerHTML,subDisplay.innerHTML))
            subDisplay.innerHTML = ''
        }
    }

    // Clear Screen
    else if (button === 'C'){
        display.innerHTML = '0'
        subDisplay.innerHTML = ''
    }

    // Evaluate two part math expressions
    else if (['+','-','/','*'].includes(button)){
        if (!!subDisplay.innerHTML) {
            subDisplay.innerHTML = String(evalExpr(display.innerHTML,subDisplay.innerHTML))
            display.innerHTML = '0'
        }
        else {
            subDisplay.innerHTML = display.innerHTML + button
            display.innerHTML = '0'
        }
    }

    // Evaluate 1 part math expression
    else if (['^2','√','+/-', '%'].includes(button)){
        display.innerHTML = String(evalTerm(display.innerHTML,button))
        if (!!subDisplay.innerHTML) {
            display.innerHTML = String(evalExpr(display.innerHTML,subDisplay.innerHTML))
            subDisplay.innerHTML = ''
        }
    }

    // Remove leading 0
    else if (display.innerHTML === '0' && button !== '.'){
        display.innerHTML = button
    }

    // Input Numbered input
    else {
        display.innerHTML += button
    }
}

function evalExpr(display:string, subDisplay:string) : number {
    const op = subDisplay.slice(-1)
    const x = Number(subDisplay.slice(0,-1))
    const y = Number(display)

    switch (op){
        case '+': return x + y
        case '-': return x - y
        case '*': return x * y
        case '/': return x / y
        default: return NaN
    }
}

function evalTerm(display:string, op:string) : number {
    const x = Number(display)
    switch (op) {
        case '^2': return x ** 2
        case '√': return Math.sqrt(x)
        case '%': return x / 100
        case '+/-': return -1*x
        default: return NaN
    }
}

// Run Code
if (typeof window !== 'undefined'){
    window.onload = () => {
        graphicCalculator([
            'C','^2','%','/',
            '7','8','9','*',
            '4','5','6','-',
            '1','2','3','+',
            '+/-','0','.','='
        ])
    }
}
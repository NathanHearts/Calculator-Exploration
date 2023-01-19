import parseEval from './parserCalculator'

// Takes Array of button values and puts them on a grid
function app(buttons:Array<string>){
    // Element Constants
    const grid = document.getElementById('grid')
    const display = document.getElementById('display') as HTMLInputElement

    // Generate Button Element
    buttons.forEach(button => {
        const btn = document.createElement('button')
        btn.textContent = button
        btn.classList.add('grid-button')

        // Button Logic
        if (button === '='){
            btn.onclick = () => display.innerHTML = parseEval(display.innerHTML)
            btn.classList.add('grid-button-equals')
        }
        else if (button === 'C'){
            btn.onclick = () => display.innerHTML = ''
        }
        else {
            btn.onclick = () => display.innerHTML += button
        }

        grid?.appendChild(btn)
    })
}

// Run Code
if (typeof window !== 'undefined'){
    window.onload = () => {
        app([
            'C','(',')','%','/',
            '!','7','8','9','*',
            '^2','4','5','6','-',
            '^y','1','2','3','+',
            '-/','+/-','0','.','='
        ])
    }
}
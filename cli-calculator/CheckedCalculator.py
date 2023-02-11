# Equation Solver
def equation(x, y, op):
    if op == '+':
        return x + y
    elif op == '-':
        return x - y
    elif op == '*':
        return x * y
    elif op == '/':
        return x / y

def parse(s):
    while True:
        char = input(s)

        # Check if Number
        if char.isdigit():
            return int(char)

        # Alternativly Check if Symbol
        elif char in ('+','-','*','/'):
            return char
        
        # Error Message
        print('Enter Valid Symbol')

# Type Checked Calculator App
def calculator():
    # Inputs
    firstNumber = parse('First Number: ')
    operation = parse('Operation: ')
    secondNumber = parse('Second Number: ')

    # Solve Equation
    answer = equation(firstNumber, secondNumber,  operation)

    # Print Result String
    print(f'{firstNumber} {operation} {secondNumber} = {answer}')


if __name__ == '__main__':
    calculator()
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


# Basic Calculator App
def calculator():
    # Inputs
    firstNum = int(input('First Number: '))
    operation = input('Operation: ')
    secondNum = int(input('Second Number: '))

    # Solve Equation
    ans = equation(firstNum, secondNum, operation)

    # Print Result String
    print(f'{firstNum} {operation} {secondNum} = {ans}')


if __name__ == '__main__':
    calculator()
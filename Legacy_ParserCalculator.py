# I love python typing
class expr:
    def __init__(self, op : str, expr1, expr2=None) -> None:
        self.op = op
        self.expr1 = expr1
        self.expr2 = expr2


    def __str__(self) -> str:
        if self.op in ('', '()'):
            return f'{self.op} {str(self.expr1)}'
        else:
            return f'{self.op} ({str(self.expr1)} {str(self.expr2)})'


    # def solve(self):
    #     # Base Case
    #     if self.expr1.isdigit():
    #         return int(self.expr1)
    #     # Brackets

    #     if self.expr2 == None: 
    #         return self.solve(self.expr1)
        
        
    #     if self.op == '+':
    #         return self.solve(self.expr1) + self.expr2
    #     elif self.op == '-':
    #         return self.solve(self.expr1) - self.expr2
    #     elif self.op == '*':
    #         return self.solve(self.expr1) * self.expr2
    #     elif self.op == '/':
    #         return self.solve(self.expr1) / self.expr2


# Parse Number
def parseNum(token : str) -> expr:
    return expr('', int(token))


# Parse Brackets
def parseBrackets(token : str) -> expr:
    for i in range(len(token)):
        if token[i] == '(':
            bracketCount = 0

            for j in range(i+1, len(token)):
                # Ensure Inner Brackets included in expr
                if token[j] == '(':
                    bracketCount += 1
                elif token[j] == ')' and bracketCount:
                    bracketCount -= 1

                # Return Bracketed expression
                elif token[j] == ')' and not bracketCount:
                    return (expr('()', parse(token[i+1:j])))

            print('Brackets Not Equal')

    return parseNum(token)


# Parse Multiplication and Division
def parseMulDiv(token : str) -> expr:
    for i in range(len(token)):
        if token[i] in ('*','/'):
            return expr(token[i], parse(token[:i]), parse(token[i+1:]))
    return parseBrackets(token)


# Parse Addition and Subtraction
def parse(token : str) -> expr:
    for i in range(len(token)):
        if token[i] in ('+','-'):
            return expr(token[i], parse(token[:i]), parse(token[i+1:]))
    return parseMulDiv(token)
    

# Type Checked Calculator App
def calculator():
    # Inputs
    equation = input('Input Equation: ')
    x = parse(equation)
    print(x)


if __name__ == '__main__':
    calculator()
   
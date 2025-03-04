let currentExpression = ''; // 계산식 변수 선언



//디스플레이 제어 함수

// 계산식에 문자 추가
function appendCharacter(character) {
    currentExpression += character;
    updateDisplay();
}

// 마지막 문자 삭제
function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

// 디스플레이 초기화
function clearDisplay() {
    currentExpression = '';
    updateDisplay();
}

// 디스플레이 업데이트
function updateDisplay() {
    document.getElementById('display').value = currentExpression;
}



//계산함수

// 계산 결과를 계산하는 함수
function calculateResult() {
    try {
        const result = evaluateExpression(currentExpression);
        currentExpression = result.toString(); // 계산 후 결과를 새로운 계산식으로 설정
        updateDisplay();
    } catch (e) {
        document.getElementById('display').value = 'Error'; // 오류 처리
    }
}

// 연산자 우선순위에 맞게 계산해주기!
function evaluateExpression(expression) {
    let operators = ['+', '-', '*', '/'];

    // 곱셈과 나눗셈 우선 처리
    expression = evaluateByOperators(expression, ['*', '/']);

    // 덧셈과 뺄셈 처리
    expression = evaluateByOperators(expression, ['+', '-']);

    return expression;
}

// 주어진 연산자들로 계산을 처리하는 함수, 처음부터 모든 연산자, 숫자를 받아와 정리
function evaluateByOperators(expression, operators) {

    //match[] 배열에 한 칸에 소수점까지 한번에 넣는 regex
    let regex = new RegExp(`(\\d+(\\.\\d+)?)([${operators.join('')}])(\\d+(\\.\\d+)?)`, 'g');
    let match;

    //한칸에 소수점까지 넣기에 1, 3 ,4 로 처리가능
    while ((match = regex.exec(expression)) !== null) { // <- 여기서 match 배열로 넣는다.
        let left = parseFloat(match[1]);
        let operator = match[3];
        let right = parseFloat(match[4]);

        let result;

        if (operator === '+') {
            result = left + right;
        } else if (operator === '-') {
            result = left - right;
        } else if (operator === '*') {
            result = left * right;
        } else if (operator === '/') {
            if (right === 0) {
                throw new Error('Division by zero'); // 0으로 나누는 경우 예외 처리
            }
            result = left / right;
        }

        // 계산된 값을 다시 표현식에 대체, 재탐색 시 오류가 없게 하기 위해
        expression = expression.slice(0, match.index) + result + expression.slice(match.index + match[0].length);
        regex.lastIndex = match.index + result.toString().length; // 다음 연산을 위해 인덱스 조정
    }

    return expression;
}

// 키보드 입력 처리
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/[0-9]/.test(key)) {
        appendCharacter(key);
    } else if (key === ".") {
        appendCharacter(".");
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        appendCharacter(key);
    } else if (key === "Enter") {
        calculateResult();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Escape") {
        clearDisplay();
    }
});

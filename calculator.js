let currentExpression = ''; // 계산식 변수 선언

// 계산식, 디스플레이 관련 함수, 계산식에 문자 추가
function appendCharacter(character) {
    currentExpression += character;
    document.getElementById('display').value = currentExpression; // 계산식 표시
}

// 마지막 문자 삭제하기
function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    document.getElementById('display').value = currentExpression; // 계산식 수정
}

// 디스플레이 초기화
function clearDisplay() {
    currentExpression = '';
    document.getElementById('display').value = ''; // 디스플레이 초기화
}


//계산함수

// 계산 결과를 계산하는 함수
function calculateResult() {
    try {
        const result = evaluateExpression(currentExpression);
        document.getElementById('display').value = result; // 결과 표시

        currentExpression = result; // 계산 후 결과를 새로운 계산식으로 설정

    } catch (e) {
        document.getElementById('display').value = 'Error'; // 오류 처리
    }
}

// 연산자 우선순위에 맞게 순서를 맞춰 계산하는 함수!
function evaluateExpression(expression) {
    // 먼저 곱셈과 나눗셈을 처리하고, 그 후 덧셈과 뺄셈을 처리
    let operators = ['+', '-', '*', '/'];
    
    // 첫 번째로 곱셈과 나눗셈 계산
    expression = evaluateByOperators(expression, ['*', '/']);
    
    // 그 후 덧셈과 뺄셈 계산
    expression = evaluateByOperators(expression, ['+', '-']);
    
    return expression;
}

// 주어진 연산자들로 계산을 처리하는 함수
function evaluateByOperators(expression, operators) {

    //아예 새로 정리해서 match 배열에 넣기 match[0] = 전체수식, 각 배열에 소수점까지 들어간다!
    let regex = new RegExp(`(\\d+(\\.\\d+)?)([${operators.join('')}])(\\d+(\\.\\d+)?)`, 'g');
    let match;
    
    while ((match = regex.exec(expression)) !== null) {
        //정규식에서 이미 구분해 하나의 배열칸에 넣었기에 1, 3, 4 로 정리가능 
        let left = parseFloat(match[1]);
        let operator = match[3];
        let right = parseFloat(match[4]);
        
        let result;
        
        // 연산자에 따라 계산
        if (operator === '+') {
            result = left + right;
        } else if (operator === '-') {
            result = left - right;
        } else if (operator === '*') {
            result = left * right;
        } else if (operator === '/') {
            if (right === 0) {
                throw new Error('Division by zero'); // 0으로 나누는 경우 처리
            }
            result = left / right;
        }
        
        // 계산된 값을 다시 표현식에 대체 이미 계산된 값으로 대체해 재탐색 시 오류가 없게
        expression = expression.slice(0, match.index) + result + expression.slice(match.index + match[0].length);
        regex.lastIndex = match.index + result.toString().length; // 다음 일치를 위해 인덱스 조정
    }
    
    return expression;
}

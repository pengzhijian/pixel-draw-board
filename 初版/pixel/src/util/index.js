      // chatgpt生成的
      // 解析字符串转换成算式，输出结果，支持加减乘除括号
      // calculateExpression("1+12*4-8/2") 输出44
      function calculateExpression(expression) {
        // 移除空格
        expression = expression.replace(/\s+/g, '');
        
        // 处理括号
        while (/\([^\(\)]+\)/.test(expression)) {
          expression = expression.replace(/\(([^\(\)]+)\)/, (_, innerExpression) => {
            return calculateExpression(innerExpression);
          });
        }

        // 解析乘法和除法
        while (/[*/]/.test(expression)) {
          expression = expression.replace(/(\d+)([*/])(\d+)/, (_, num1, operator, num2) => {
            console.log(555555555555, _)
            if (operator === '*') {
              return parseInt(num1) * parseInt(num2);
            } else if (operator === '/') {
              return parseInt(num1) / parseInt(num2);
            }
          });
        }

        console.log('777777777777', expression)
        // 解析加法和减法
        // 这一步相当于取得第一个数，然后剩下的就都是 -6+1-5+124之类的，一个符号一个数字
        let result = parseInt(expression);
        console.log('1111222222222', result)
        while (/[-+]/.test(expression)) {
          expression = expression.replace(/([+-])(\d+)/, (_, operator, num) => {
            if (operator === '+') {
              result += parseInt(num);
            } else if (operator === '-') {
              result -= parseInt(num);
            }
          });
        }

        return result;
      }
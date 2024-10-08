### 1. **`DOMContentLoaded` Event Listener**

```javascript
document.addEventListener("DOMContentLoaded", () => { ... });
```

- Esse trecho de código espera o documento HTML carregar completamente antes de executar o script.
- Assim, você garante que todos os elementos necessários (botões, displays, etc.) estejam disponíveis para serem manipulados.

### 2. **Seleção de Elementos do DOM**

```javascript
const historyElement = document.querySelector(".history ul");
const resultElement = document.querySelector(".result p");
const numberButtons = document.querySelectorAll(".numbers li, .numbSimbol li, .simbol li");
const equalButton = document.getElementById("equal");
```

- Aqui, você está pegando os elementos HTML que serão manipulados:
  - `historyElement`: seleciona a lista de histórico (elemento `<ul>`) dentro da classe `.history`.
  - `resultElement`: seleciona o parágrafo (`<p>`) que exibe o resultado dentro da classe `.result`.
  - `numberButtons`: seleciona todos os botões que representam números e operadores (`li` dentro das classes `.numbers`, `.numbSimbol`, e `.simbol`).
  - `equalButton`: seleciona o botão `igual` (`id="equal"`) que realiza a operação matemática.

### 3. **Variáveis de Controle**

```javascript
let currentExpression = "";
let history = [];
let shouldReset = false;
```

- `currentExpression`: armazena a expressão atual que o usuário está digitando (e.g., `2+3*5`).
- `history`: um array que guarda o histórico das operações realizadas.
- `shouldReset`: um booleano que controla se a calculadora deve resetar o display após uma operação.

### 4. **Adicionando Evento de Clique aos Botões de Número e Operadores**

```javascript
numberButtons.forEach((button) => {
  button.addEventListener("click", () => { ... });
});
```

- Cada botão dentro do array `numberButtons` recebe um `event listener` que executa uma ação quando o botão é clicado.
  
#### Dentro do Event Listener de cada botão

```javascript
const value = button.textContent.trim();
```

- `value`: obtém o valor do botão clicado (por exemplo, `1`, `+`, `X²`) e remove espaços indesejados com `trim()`.

#### Verificando se deve resetar o display

```javascript
if (shouldReset && !["/", "*", "-", "+", "%", "X²"].includes(value)) {
  currentExpression = "";
  shouldReset = false;
}
```

- Se `shouldReset` é `true` e o valor clicado não é um operador matemático, o display é resetado (a expressão atual é apagada) e `shouldReset` é definido como `false`.
- Isso é útil para evitar que resultados anteriores sejam concatenados com a nova expressão.

#### Prevenindo operadores repetidos

```javascript
if (["/", "*", "-", "+", "%", "X²"].includes(value) && ["", "/", "*", "-", "+", "%", "("].includes(currentExpression.slice(-1))) {
  return;
}
```

- Essa condição evita que operadores sejam inseridos repetidamente (por exemplo, não permite `2++3`).
- `currentExpression.slice(-1)`: verifica o último caractere da expressão atual para impedir operadores duplicados.

#### Adicionando operadores e números à expressão

```javascript
switch (value) {
  case "X":
    currentExpression += "*";
    break;
  case "X²":
    currentExpression += "**2";
    break;
  case ",":
    currentExpression += ".";
    break;
  case "%":
    currentExpression += "*0.01";
    break;
  default:
    currentExpression += value;
}
```

- `switch` define como cada botão deve se comportar:
  - `"X"` é convertido em `"*"` para multiplicação.
  - `"X²"` é convertido em `"**2"` para calcular o quadrado.
  - `","` é convertido em `"."` para números decimais.
  - `"%"` é convertido em `*0.01` para calcular porcentagens.
  - O `default` adiciona o valor diretamente à expressão para números ou outros símbolos.

#### Atualizando o display

```javascript
resultElement.textContent = currentExpression;
```

- A expressão atual é exibida no elemento `resultElement` (`<p>`).

### 5. **Evento de Clique no Botão de Igualdade (Cálculo da Expressão)**

```javascript
equalButton.addEventListener("click", () => { ... });
```

- Quando o botão `igual` é clicado, ocorre a tentativa de calcular a expressão.

#### Prevenindo o caractere `=` no final

```javascript
if (currentExpression.slice(-1) === "=") {
  currentExpression = currentExpression.slice(0, -1);
}
```

- Caso a expressão termine com um `=`, ele é removido para evitar erros.

#### Calculando o resultado

```javascript
let result = eval(currentExpression);
```

- A função `eval` é utilizada para calcular a expressão.
- Nota: `eval` deve ser usado com cuidado por questões de segurança, mas aqui ele é seguro pois apenas usa entradas controladas pelo usuário.

#### Tratamento de Erros

```javascript
if (!isNaN(result)) {
  history.push(`${currentExpression} = ${result}`);
  if (history.length > 4) {
    history.shift();
  }
  historyElement.innerHTML = history.map((item) => `<li>${item}</li>`).join("");
  
  currentExpression = result.toString();
  resultElement.textContent = currentExpression;
  shouldReset = true;
} else {
  throw new Error("Resultado inválido");
}
```

- Se o resultado for válido (`!isNaN(result)`), ele é:
  1. Adicionado ao histórico.
  2. Exibido na lista de histórico.
  3. A expressão atual é substituída pelo resultado.
  4. `shouldReset` é definido como `true` para que a próxima entrada comece do zero.
- Se o resultado for inválido, é gerado um erro.

#### Tratamento de erro no cálculo

```javascript
catch (error) {
  resultElement.textContent = "Erro";
  currentExpression = "";
  shouldReset = false;
}
```

- Se ocorrer um erro (e.g., expressão incompleta), exibe `"Erro"` e limpa a expressão atual.

### 6. **Funções para Limpar o Display e Deletar o Último Caractere**

```javascript
const clearDisplay = () => {
  currentExpression = "";
  resultElement.textContent = "";
  shouldReset = false;
};
```

- `clearDisplay`: limpa o display e reseta a expressão.

```javascript
const deleteLastChar = () => {
  currentExpression = currentExpression.slice(0, -1);
  resultElement.textContent = currentExpression;
};
```

- `deleteLastChar`: remove o último caractere da expressão.

### 7. **Eventos de Clique para Limpar e Deletar**

```javascript
document.querySelector('img[alt="backspace"]').addEventListener("click", clearDisplay);
document.querySelector('img[alt="back"]').addEventListener("click", deleteLastChar);
```

- Associa as funções `clearDisplay` e `deleteLastChar` aos botões de backspace (`backspace`) e deleta (`back`).

Com isso, o script manipula o display e realiza os cálculos da calculadora. Se precisar de mais detalhes ou ajustes, me avise!

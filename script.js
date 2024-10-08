document.addEventListener("DOMContentLoaded", () => {
  const historyElement = document.querySelector(".history ul");
  const resultElement = document.querySelector(".result p");
  const numberButtons = document.querySelectorAll(".numbers li, .numbSimbol li, .simbol li");
  const equalButton = document.getElementById("equal");
  const themeToggleButton = document.getElementById("theme-toggle");
  let currentExpression = "";
  let displayExpression = "";
  let history = [];
  let shouldReset = false;

  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent.trim();

      if (shouldReset && !["/", "*", "-", "+", "%", "X²", "√"].includes(value)) {
        currentExpression = "";
        displayExpression = "";
        shouldReset = false;
      }

      if (["/", "*", "-", "+", "%", "X²", "√"].includes(value) && ["", "/", "*", "-", "+", "%", "("].includes(currentExpression.slice(-1))) {
        return;
      }

      switch (value) {
        case "X":
          currentExpression += "*";
          displayExpression += "×";
          break;
        case "X²":
          currentExpression += "**2";
          displayExpression += "^2";
          break;
        case "√":
          if (currentExpression !== "" && !isNaN(currentExpression.slice(-1))) {
            currentExpression = `Math.sqrt(${currentExpression})`;
            displayExpression = `√${displayExpression}`;
          }
          break;
        case ",":
          currentExpression += ".";
          displayExpression += ",";
          break;
        case "%":
          currentExpression += "*0.01";
          displayExpression += "%";
          break;
        default:
          currentExpression += value;
          displayExpression += value;
      }

      resultElement.textContent = displayExpression;
    });
  });

  equalButton.addEventListener("click", () => {
    try {
      if (currentExpression.slice(-1) === "=") {
        currentExpression = currentExpression.slice(0, -1);
      }

      if (displayExpression.slice(-1) === "=") {
        displayExpression = displayExpression.slice(0, -1);
      }

      let result = eval(currentExpression);

      if (!isNaN(result)) {
        history.push(`${displayExpression} = ${result}`);

        if (history.length > 3) {
          history.shift();
        }

        historyElement.innerHTML = history.map((item) => `<li><p>${item}</p></li>`).join("");

        currentExpression = result.toString();
        displayExpression = currentExpression;

        resultElement.textContent = displayExpression;
        shouldReset = true;
      } else {
        throw new Error("Resultado inválido");
      }
    } catch (error) {
      resultElement.textContent = "Erro";
      currentExpression = "";
      displayExpression = "";
      shouldReset = false;
    }
  });

  const clearDisplay = () => {
    currentExpression = "";
    displayExpression = "";
    resultElement.textContent = "";
    shouldReset = false;
  };

  const deleteLastChar = () => {
    currentExpression = currentExpression.slice(0, -1);
    displayExpression = displayExpression.slice(0, -1);
    resultElement.textContent = displayExpression;
  };

  document.querySelector('img[alt="backspace"]').addEventListener("click", clearDisplay);
  document.querySelector('img[alt="back"]').addEventListener("click", deleteLastChar);

  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.querySelector("main").classList.toggle("light-mode");
    document.querySelector(".history").classList.toggle("light-mode");
    document.querySelector(".result").classList.toggle("light-mode");
    document.querySelector(".fas").classList.toggle("light-mode");
    document.getElementById("theme-toggle").classList.toggle("light-mode");
    numberButtons.forEach((button) => button.classList.toggle("light-mode"));
    const themeIcon = document.getElementById("theme-icon");
  
    if (document.body.classList.contains("light-mode")) {
      themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  });
});

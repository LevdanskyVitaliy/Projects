const digitInputs = document.querySelectorAll(".digit-input");
const checkButton = document.getElementById("check-btn");
const newGameBtn = document.getElementById("new-game-btn");
const resultDiv = document.querySelector("#result");
const attemptsList = document.getElementById("attempts-list");
const errorMessage = document.querySelector("#error-message");

let secretNumber = "";
let attempts = [];

/*Функция начала игры, генерация случайного чилса*/
const StartGame = () => {
  console.log("НАЧАЛО НОВОЙ ИГРЫ");

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  secretNumber = "";
  let fisrtDigitIndex = Math.floor(Math.random() * 9 + 1);
  secretNumber += digits[fisrtDigitIndex];
  digits.splice(fisrtDigitIndex, 1);
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    secretNumber += digits[randomIndex];

    digits.splice(randomIndex, 1);
  }

  resultDiv.innerHTML = "";
  attemptsList.innerHTML = "";

  console.log("everything is clear");

  console.log("Secret number is: " + secretNumber);

  return secretNumber;
};

digitInputs.forEach((input) => {
  console.log("input =---- " + input);
  input.value = "";
  input.addEventListener("input", () => {
    if (input.value !== "") {
      input.classList.add("bg-black");
    } else {
      input.classList.remove("bg-black");
    }
  });
});

resultDiv.innerHTML = "";
resultDiv.className =
  "mt-5 p-4 rounded-lg min-h-16 flex justify-center items-center flex-col";

attemptsList.innerHTML = "";

attempts = [];
errorMessage.innerHTML = "";

const ClearAll = () => {
  resultDiv.innerHTML = "";
  attemptsList.innerHTML = "";
  console.log("everything is clear");
};

// Фокус на первом поле
digitInputs[0].focus();
console.log("Секретное число загадано:", secretNumber);

// Проверка введенного числа
const checkGuess = () => {
  const guess = Array.from(digitInputs)
    .map((input) => input.value)
    .join("");

  const uniqueDigits = new Set(guess);
  console.log("unigue digits - " + uniqueDigits.size);
  console.log("guessAr - " + digitInputs.length);

  if (uniqueDigits.size !== digitInputs.length) {
    console.log("ОШИБКА: Найдены повторяющиеся цифры");
    errorMessage.innerHTML = "Цифры не должны повторяться!";
    return;
  }

  console.log("Guess Array" + guess);

  let bulls = "";
  let cows = "";

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secretNumber[i]) {
      bulls++;
    } else if (secretNumber.includes(guess[i])) {
      cows++;
    } else {
      console.log("unluck");
    }
  }

  console.log(`Результат: ${bulls} быков, ${cows} коров`);

  attempts.unshift({
    guess: guess,
    bulls: bulls,
    cows: cows,
  });

  console.log("Всего попыток:", attempts.length);

  if (bulls === 4) {
    console.log("Число угадано!");
    resultDiv.innerHTML = `Поздравляем! Вы угадали число ${secretNumber} за ${attempts.length} попыток!`;
    resultDiv.className = "text-green-500";
  } else {
    console.log("наш бой продолжается");
    resultDiv.innerHTML = `Результат: ${bulls} бык(а/ов), ${cows} коров(а/ы)`;
    resultDiv.className =
      "mt-5 p-4 rounded-lg min-h-16 flex justify-center items-center flex-col bg-white";
    checkButton.disabled = false;
  }

  updateAttemptsList();

  digitInputs.forEach((e) => {
    e.value = "";
    e.classList.remove("bg-black");
    checkButton.disabled = true;
  });

  updateCheckButton();
  digitInputs[0].focus();
};

const updateAttemptsList = () => {
  console.log("Обновление списка попыток");

  attemptsList.innerHTML = "";

  attempts.forEach((attempt) => {
    const attemptItem = document.createElement("div");
    attemptItem.className = "flex justify-between p-2";

    attemptItem.innerHTML = `
            <p class="font-medium">${attempt.guess}</p>
            <span>
                <p class="text-red-500 font-bold">${attempt.bulls}Б</p> 
                <p class="text-blue-500 font-bold">${attempt.cows}К</p>
            </span>

        `;

    attemptsList.appendChild(attemptItem);
  });
};

const updateCheckButton = () => {
  const allFilled = Array.from(digitInputs).every(
    (input) => input.value !== ""
  );
  console.log("Все поля заполнены:", allFilled);
  if (!allFilled) {
    checkButton.disabled;
    checkButton.classList.add("bg-gray-500");
  } else {
    checkButton.disabled = false;

    checkButton.classList.remove("bg-gray-500");
    return;
  }
};

const initGame = () => {
  console.log("ИНИЦИАЛИЗАЦИЯ ИГРЫ");

  digitInputs.forEach((input, index) => {
    console.log(`Настройка обработчиков для поля ${index}`);

    input.addEventListener("input", function () {
      // Проверrка что введена цифра
      if (this.value && !/^\d$/.test(this.value)) {
        console.log("ОШИБКА: Введен недопустимый символ");
        this.value = "";
        errorMessage.innerHTML = "Вводите только цифры!";
        this.classList.remove("bg-black");

        return;
      }
      errorMessage.textContent = "";

      if (index < 3) {
        digitInputs[index + 1].focus();
      }

      updateCheckButton();
    });

    input.addEventListener("keydown", function (e) {
      console.log("this VALUE - - " + this.value);
      if (e.key === "Backspace" && index > 0 && !this.value) {
        digitInputs[index - 1].focus();
      }
    });
  });

  checkButton.addEventListener("click", () => {
    console.log('Нажата кнопка "Проверить"');
    checkGuess();
  });

  newGameBtn.addEventListener("click", () => {
    console.log('Нажата кнопка "Новая игра"');

    StartGame();
    ClearAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !checkButton.disabled) {
      console.log("Нажата кнопка Enter");
      checkGuess();
    }
  });

  StartGame();
};

initGame();

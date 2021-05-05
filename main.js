const API =
  "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple";
const question = document.getElementById("question");
const multipleChoices = document.querySelector(".multiple-choices");
const submit = document.getElementById("submit");
const inputCheck = document.getElementsByTagName("input");
const warnUser = document.getElementById("correct-or-incorrect");
const timer = document.getElementById("timer");
let timerCount = 15;
let index = 0;
const fetchData = () => {
  fetch(API)
    .then((response) => {
      if (!response.ok) {
        throw Error("Error");
      }
      return response.json();
    })
    .then((data) => {
      const results = data.results;

      // get first question and first set of choices
      getQuestion(question, results, index);

      let correctAnswer = results[index].correct_answer;

      shuffleAnswers(getAllAnswers(index, results)).map((answer) => {
        multipleChoices.appendChild(createMultipleChoice(answer));
      });

      // all treatments inside the sumbit method might be refactorized
      submit.onclick = (e) => {
        e.preventDefault();
        for (let i in inputCheck) {
          if (inputCheck[i].checked) {
            if (isUserChoiceCorrect(inputCheck[i].value, correctAnswer)) {
              timerCount = 15;

              startTimer();

              warnUser.innerHTML = "correct";
              warnUser.classList.contains("error")
                ? warnUser.classList.remove("error")
                : "";
              warnUser.classList.add("success");
              let currentAnswers = document.getElementsByClassName(
                "question-" + index
              );

              while (currentAnswers.length > 0) {
                currentAnswers[0].remove();
              }

              index++;
              correctAnswer = results[index].correct_answer;

              getQuestion(question, results, index);
              shuffleAnswers(getAllAnswers(index, results)).map((answer) => {
                multipleChoices.appendChild(createMultipleChoice(answer));
              });
              console.log(correctAnswer);
              console.log(index);
            } else {
              warnUser.innerHTML = "incorrect";
              warnUser.classList.contains("success")
                ? warnUser.classList.remove("success")
                : "";
              warnUser.classList.add("error");
            }
          }
        }
      };
    })
    .catch((error) => {
      console.log(error);
    });
};

fetchData();

// All methods might be in separate file

const setAttributes = (el, attrs) => {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

const createMultipleChoice = (answers) => {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const labelText = document.createTextNode(answers);

  div.setAttribute("class", "question-" + index);
  label.appendChild(labelText);
  label.setAttribute("for", "question");
  setAttributes(input, {
    type: "radio",
    name: "question",
    value: answers,
  });
  div.appendChild(label);
  div.appendChild(input);
  return div;
};

const isUserChoiceCorrect = (userChoice, correctAnswer) => {
  return userChoice === correctAnswer ? true : false;
};

const getQuestion = (question, results, index) => {
  return (question.innerHTML = `${index + 1} : ${results[index].question}`);
};

const getAllAnswers = (index, results) => {
  const allAnswers = [];
  let incorrectAnswers = results[index].incorrect_answers;
  let correctAnswer = results[index].correct_answer;

  allAnswers.push(...incorrectAnswers, correctAnswer);
  return allAnswers;
};

const shuffleAnswers = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

const startTimer = () => {
  timer.innerText = timerCount;
  timerCount = timerCount - 1;
  timerCount <= 0 ? clearInterval(counter) : "";
};

const counter = setInterval(startTimer, 1000);

startTimer();

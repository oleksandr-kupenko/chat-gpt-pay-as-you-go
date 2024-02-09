import {GPT_MODEL, Message, ROLE, State} from './app.interface';

export const messagesMock: Message[] = [
  {
    role: ROLE.assistant,
    content:
      '<p>Вот пример метода перебора массива в JavaScript:</p>\n\n```javascript\nfunction iterateArray(array) {\n  array.forEach(function(element) {\n    console.log(element);\n  });\n}\n\nvar fruits = ["яблоко", "банан", "груша"];\niterateArray(fruits);\n```\n\n<p>Этот метод использует функцию `forEach`, которая принимает в качестве аргумента функцию-колбэк. Функция-колбэк будет вызываться для каждого элемента массива, передавая элемент в качестве аргумента. В примере выше функция-колбэк просто выводит элемент в консоль.</p>\n\n<p>Вывод:</p>\n\n```\nяблоко\nбанан\nгруша\n```\n\n<p>Здесь массив `fruits` содержит строки "яблоко", "банан" и "груша". Перебор элементов массива осуществляется с помощью вызова функции `iterateArray(fruits)`, которая передает каждый элемент массива в колбэк функции. В результате выводятся все элементы массива на консоль.</p>',
  },
];

export const configMock: State = {
  settings: {rememberKey: true},
  chat: {
    model: GPT_MODEL.GPT_35,
    chats: [{tokens: 500, id: '0', messages: messagesMock, name: 'Some name', model: GPT_MODEL.GPT_35}],
  },
};

# Slider for JQuery - 4 task MetaLamp

[Демо-страница](https://maxim-altuhov.github.io/slider-plugin/)

В данном репозитории находится плагин для JQuery, который позволяет добавить функционал слайдера ("бегунка") на страницу сайта. Слайдер - это специальный элемент, который с помощью перетягивания контроллера позволяет задавать числовые/текстовые значения или их диапазоны.

Данный плагин является результатом выполнения 4 задания программы обучения MetaLamp. Проект совместим с версиями Node 14.x и jQuery 3.x.

## Разделы

* [`Описание плагина`](#Описание-плагина)
* [`Развертывание проекта`](#Развертывание-проекта)
* [`Подключение плагина`](#Подключение-плагина)
* [`Опции плагина`](#Опции-плагина)
* [`API плагина`](#API-плагина)
* [`Архитектура`](#Архитектура)
* [`UML-диаграмма классов`](#UML-диаграмма-классов)
* [`Использованные в проекте инструменты`](#Использованные-в-проекте-инструменты)

## Описание плагина

* Можно задавать любые текстовые/числовые значения или их комбинации
* На одной странице можно подключить неограниченное кол-во слайдеров с индивидуальными настройками для каждого
* Имеет адаптивную верстку, подстраивается под ширину/высоту контейнера в котором он инициализирован
* Поддержка сенсорных устройств
* Поддержка управления с клавиатуры
* Поддержка отрицательных значений
* Одиночный вид или диапазон
* Вертикальный или горизонтальный вид
* Адаптивная шкала с делениями, которая подстраивается под размер слайдера
* Возможность отдельно задавать шаг слайдера и шаг делений на самой шкале слайдера
* Возможность полностью настроить внешний вид, скрыть любые элементы слайдера и настроить его под свой вкус

## Развертывание проекта

```bash
  git clone https://github.com/maxim-altuhov/slider-plugin.git
```

### Установка npm пакетов

`npm install` или `npm i`

### Доступные команды

* `npm run dev` - сборка проекта в режиме "development";
* `npm run build` - сборка проекта в режиме "production";
* `npm run start` - запуск для разработки в режиме "dev server";
* `npm run test` - запуск тестов со сбором покрытия и формированием папки "coverage";
* `npm run deploy` - выгрузка проекта из папки dist на GitHub Pages;
* `npm run lint` - проверка проекта ESLint`ом и на ошибки в типизации;

## Подключение плагина

Плагин должен подключаться к уникальному идентификатору на странице.
Если необходимо подключить несколько плагинов, нужно заранее позаботиться о том, чтобы каждый селектор к которому подключается плагин имел уникальный идентификатор на странице.

Для работы плагина требуется предварительно подключить jQuery версии 3.x.
Из папки `./plugin` необходимо скопировать к себе в проект все файлы и подключить их как в примере ниже.

Пример подключения:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  ...
  <!--metaSlider CSS file-->
  <link rel="stylesheet" href="./metaSlider.min.css">
</head>
<body>

  <!--HTML код-->
  <div id="slider"></div>

  <!--jQuery plugin-->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <!--metaSlider JavaScript file-->
  <script src="./metaSlider.min.js"></script>
</body>
</html>
```

Инициализация с настройками по умолчанию:

```js
  // JavaScript
  $('#slider').metaSlider();
```

Инициализация с пользовательскими настройками:

```js
  // JavaScript
  $('#slider').metaSlider({
    mainColor: '#ffb13c',
    secondColor: '#fbd3b0',
    colorForScale: '#814100',
    colorBorderForThumb: '#a9521e',
    colorBorderForMarker: '#a9521e',
    colorTextForMarker: '#000',
    customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
    initValueFirst: 1,
    initValueSecond: 3,
  });
```

## Опции плагина

| Опции                       | Тип данных       |  По-умолчанию                  | Описание                   |
| --------------------------- | :--------------: | :----------------------------: | :------------------------: |
| `initValueFirst`            | number           | равно `minValue`               | Значение первого "бегунка" |
| `initValueSecond`           | number           | равно `maxValue`               | Значение второго "бегунка" / значение "бегунка" при выключенном диапазоне (`isRange = false`) |
| `minValue`                  | number           | `0` или `initValueFirst`       | Мин. значение |
| `maxValue`                  | number           | `100` или `initValueSecond`    | Макс. значение |
| `step`                      | number           | `1`                            | Значение шага слайдера |
| `stepSizeForScale`          | number           | равно `step`                   | Значение шага шкалы |
| `customValues`              | (string \| number)[] |  `[]`                          | Пользовательские значения, через запятую |
| `preFix`                    | string           |  `''`                          | Устанавливает "префикс" перед значениями слайдера и значениями шкалы |
| `postFix`                   | string           |  `''`                          | Устанавливает "постфикс" после значений слайдера и значений шкалы |
| `numberOfDecimalPlaces`     | number           |  `0`                           | Кол-во отображаемых знаков после запятой |
| `initFormatted`             | boolean          |   `true`     | Форматирование, использует метод `toLocaleString()` для изменения формата отображаемых значений |
| `initAutoMargins`           | boolean          |   `true`     | Автоотсупы снизу и сверху слайдера |
| `initScaleAdjustment`       | boolean          |   `true`     | Автоподстройка делений шкалы, если значения на шкале не помещаются на экран, то лишние значения будут убираться |
| `calcNumberOfDecimalPlaces` | boolean          |   `true`     | Автоматический подсчёт кол-ва отображаемых знаков после запятой, в зависимости от входящих значений слайдера |
| `showScale`                 | boolean          |   `true`     | Отображение шкалы |
| `showMarkers`               | boolean          |   `true`     | Отображение подсказок над "бегунками" |
| `showBackground`            | boolean          |   `true`     | Отображение цветного фона между "бегунками" |
| `isRange`                   | boolean          |   `true`     | Отображение диапазона значений |
| `initAutoScaleCreation`     | boolean          |   `true`     | Автоматическое создание шкалы в зависимости от шага слайдера |
| `isVertical`                | boolean          |   `false`    | Отображение слайдера в вертикальном виде |
| `checkingStepSizeForScale`  | boolean          |   `false`    | Проверка шага шкалы слайдера и установка ему оптимального значения (заключается в проверке на то, что длина шкалы слайдера делится на равные части без остатка) |

### Настройки цвета слайдера

| Опции                 | Тип данных   |  По-умолчанию    | Описание      |
| --------------------- | :----------: | :--------------: | :-----------: |
| `mainColor`           |  string      |   `#6d6dff`      | Основной цвет |
| `secondColor`         |  string      |   `#e4e4e4`      | Цвет подложки |
| `colorMarker`         |  string      |   `#6d6dff`      | Цвет подсказок над "бегунками" |
| `colorTextForMarker`  |  string      |   `#ffffff`      | Цвет текста подсказок над "бегунками" |
| `colorBorderForMarker`|  string      |   `#ffffff`      | Цвет рамки вокруг подсказок над "бегунками" |
| `colorThumb`          |  string      |   `#6d6dff`      | Цвет "бегунков" |
| `colorBorderForThumb` |  string      |   `#ffffff`      | Цвет рамки вокруг "бегунков" |
| `colorForScale`       |  string      |   `#000000`      | Цвет шкалы |

## API плагина

Плагин может принимать в качестве параметра объект с опциями, либо методы плагина.

```js
  // JavaScript
  $('#slider-1').metaSlider();

  $('#slider-2').metaSlider({
    mainColor: '#ffb13c',
    secondColor: '#fbd3b0',
    colorForScale: '#814100',
    colorBorderForThumb: '#a9521e',
    colorBorderForMarker: '#a9521e',
    colorTextForMarker: '#000',
    customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
    initValueFirst: 1,
    initValueSecond: 3,
  });

  $('#slider-1').metaSlider('setProp', 'step', 10);
```

`setProp(prop: string, value: string | number | boolean | (string | number)[]): JQuery` - метод устанавливает заданное значение для свойства слайдера, возвращает объект jQuery с селектором на котором слайдер был вызван.
```js
  // JavaScript
  $('#slider').metaSlider('setProp', 'mainColor', '#ffb13c');
```

`getProp(prop: string): string | number | boolean | (string | number)[]` - метод возвращает значение указанного свойства слайдера.
```js
  // JavaScript
  const $slider = $('#slider');
  $slider.metaSlider({
    mainColor: '#ffb13c',
  })

  const mainColor = $slider.metaSlider('getProp', 'mainColor');
  console.log(mainColor); // '#ffb13c'
```

`getOptionsObj(): IPluginOptions` - метод возвращает объект с текущими свойствами слайдера и их значениями.
```js
  // JavaScript
  const $slider = $('#slider');
  $slider.metaSlider();

  const optionsObj = $slider.metaSlider('getOptionsObj');
  console.log(optionsObj); // {step: 1, mainColor: '#ffb13c', isVertical: false, …}
```

`getCurrentValues(): string[] | number[]` - метод возвращает текущие значения на которых находятся "бегунки" слайдера в виде массива.
```js
  // JavaScript
  const $slider = $('#slider');
  $slider.metaSlider({
    initValueFirst: 10,
    initValueSecond: 100,
  });

  const currentValues = $slider.metaSlider('getCurrentValues');
  console.log(currentValues); // [10, 100]
```

`destroy(): JQuery` - метод удаляет слайдер, всё его содержимое, но не удаляет сам элемент на котором был вызван слайдер. Возвращает объект jQuery с селектором на котором слайдер был вызван.
```js
  // JavaScript
  const $slider = $('#slider');
  $slider.metaSlider();

  $slider.metaSlider('destroy');
```

`subscribe(observer: Function): JQuery` - метод позволяет "подписаться" на событие обновления слайдера. Возвращает объект jQuery с селектором на котором слайдер был вызван.
```js
  // JavaScript
  const $slider = $('#slider');
  $slider.metaSlider();

  const foo = () => {
    console.log('Слайдер обновился!');
  };

  $slider.metaSlider('subscribe', foo);

  // Произошло обновление слайдера
  // Вывод в консоль => 'Слайдер обновился!'
```
`unsubscribe(observer: Function): JQuery` - метод позволяет "отписаться" от события обновления слайдера. Возвращает объект jQuery с селектором на котором слайдер был вызван.
```js
  // JavaScript
  const $slider = $('#slider');
  $slider.metaSlider();

  const foo = () => {
    console.log('Слайдер обновился!');
  };

  $slider.metaSlider('subscribe', foo);

  // Произошло обновление слайдера
  // Вывод в консоль => 'Слайдер обновился!'

  $slider.metaSlider('unsubscribe', foo); // "отписаться" от события обновления слайдера
```
## Архитектура

В основе плагина лежит MVP-архитектура с Passive View. Взаимодействие между слоями приложения, их отвязка и привязка, происходит с использованием паттерна `Observer`. Данный паттерн позволяет минимизировать связи в приложении и обеспечить передачу данных между слоями.

### Model

`Model` это слой приложения в котором хранится состояние слайдера и происходит валидация входящих данных относящихся к бизнес-логике приложения. Здесь осуществляется расчёт позиций "бегунков" после взаимодействия пользователя с элементами управления слайдером и передача нового состояния слайдера в `Presenter`. При этом передача состояния слайдера сопровождается ключом, который указывает какие элементы слайдера необходимо обновить.

### View

`View` отвечает за рендеринг основы слайдера, его внешний вид, обновление и передачу данных от более мелких компонентов слайдера (`subView`) в `Presenter`. В этом слое реализован декоратор `Throttling` для увеличения производительности кода при взаимодействии пользователя с контроллерами слайдера.

Данный слой декомпозирован на более мелкие элементы слайдера - `subView`, каждый `subView` имеет схожий интерфейс и отвечает за конкретный элемент слайдера и его внешний вид, это позволяет обновлять слайдер частично, не перерисовывая все его элементы. Связь и передача данных между `subView` и главным `View` также осуществляется с использованием паттерна `Observer`, что позволяет обеспечить слабую связанность и модульность всех элементов слайдера. 

### Presenter

`Presenter` единственный слой, который имеет зависимости от других слоёв приложения. Он является связующим звеном между слоями и подписывается на изменения в `Model` и `View`.
* Реагирует на сообщение об обновлении `Model` и обновляет `View`;
* Реагирует на сообщение о действии пользователя и обновляет `Model`;

Передача данных снизу вверх в приложении осуществляется по следующей схеме `subVeiw => View => Presenter => Model`.

## UML-диаграмма классов

![image](./uml/UML-metaSlider.svg)

[`Ссылка на полную версию`](https://4webcode.ru/projects/metalamp/UML-metaSlider.svg)

## Использованные в проекте инструменты

[`jQuery 3.6.0`](https://github.com/jquery)  
[`Webpack 5.21.2`](https://github.com/webpack/webpack)  
[`Typescript 4.4.4`](https://github.com/microsoft/TypeScript/)  
[`Babel 7.12.17`](https://github.com/babel/babel)  
[`Jest 27.3.1`](https://github.com/facebook/jest)  
[`ESLint 7.32.0`](https://github.com/eslint/eslint)  
[`Cross-env 7.0.3`](https://github.com/kentcdodds/cross-env)  
[`Gh-pages 3.1.0`](https://github.com/tschaub/gh-pages)  

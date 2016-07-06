# Middlewares и Reducers для Redux ![BuildStatus](https://travis-ci.org/kneradovsky/redents.svg?branch=master)

If you don't speak russian please consider [the english version of the README](README-Eng.md)

## Установка

```shell
npm install redux-redents
```

## Зачем
Любое веб-приложение требует загрузки данных сервера. Но как только это требуется в приложении, основанном на Redux, Вы будете вынуждены писать свой middleware или использовать существующий, но и кроме этого - требуется писать похожие редьюсеры для всех типов данных, которые требуется получать с сервера. И эта монотонная работа очень быстро надоедает. Поэтому и родилась идея сделать модуль, который бы реализовывал весь этот функционал, а разработчику требовалось бы только определить набор типов данных и операций над ними. Представляю __Redux-Redents__

Модуль реализует следующее:
1. Promise middleware, для загрузки данных с сервера и отправки данных на сервер
2. Chain middleware, для выполнения "связанных" вызовов или цепочки вызовов
3. Dictionary reducers, реализация редьюсеров для всех типов данных, основанная на соглашениях

Не нужно реализовывать ни action creators, ни reducers - нужно всего лишь использовать dictionary_reducers

## Быстрый пример
```javascript
//file index.js
//imports
import {createStore, applyMiddlware} from 'redux';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {dictionary_reducers,promiseMiddleware,chainMiddleware,createEntityOperation} from 'redux-redents';
import {Plants} from './plants';

//specify entities
const plants = {
  fruit: {},
  vegetable: {}
}
const EntConfig = {
  defaults : {
    baseUrl : 'http://server/uri'
  }
  entities : plants
}

//create reducers
const dicts = dictionary_reducers(plants);
//create store
const store = applyMiddlware(promiseMiddleware,chainMiddleware)(createStore)(dicts);

render(<Provider store={store})><Plants/></Provider>,document.getElemenentById('app'));

//file plants.js


export class Plants extends Component {
  static propTypes = {
    plants: propTypes.array.isRequired,
    plant: propTypes.object.isRequired
  }
  componentDidMount() {
    this.props.actions.entOper('fruit','index'); //load fruits list
    this.props.actions.entOper('fruit','get','apple'); //load an apple
  }
  return (
    <div>
      <ul>
        {this.props.plants.map((cur) => <li>{cur.name}</li>)} //display list of the plants
      </ul>
      <h3>{this.props.plant.name}</h3>//diplay selected plant
    <div>
  );
}

//connect props and actions to the Component
function mapStateToProps(state) {
  return {
    plants: state.fruits, //connect fruits reducer to the plants property
    plant: state.fruit
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({entOper:createEntityOperation(EntConfig)}, dispatch) //binds actions.entOper to the call of the entityOperation function
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenTransactionsPage);
```

Полный код примера доступен в  папке __client-demo__


## Соглашения и умолчания
Redux-redents использует объект Entities для получения имен entities, operations над ними и параметров этих операций.

Структура Entities:
```javascript
entities = {
  defaults: {
    baseUrl: //baseUrl - начальный URL для сервера
  },
  entities : {
    entityName : {
      operation1: {
        url: //url конкретной операции
        request: function(data) {return request object} //- функция, создающая promise для выполнения текущей операции
      }
    }
  }
}
```
По умолчанию реализованы следующие операции:
* index - загружает список Entities.
  * По соглашению использует url ``` entities.defaults.baseUrl+"/"+entityName+"s" ```
  * По соглашению использует метод get
* get - загружает entity
  * По соглашению использует url ``` entities.defaults.baseUrl+"/"+entityName+"s"+"/"+data ```
  data приходит из клиентского вызова
  * По соглашению использует метод get request
* post - сохраняет (отправляет) entity на сервер
  * По соглашению использует url ``` entities.defaults.baseUrl+"/"+entityName+"s" ```
  * По соглашению использует метод post request
  * По соглашению передает data в теле запроса
* delete - удаляет entity с сервера
  * По соглашению использует url ``` entities.defaults.baseUrl+"/"+entityName+"s" ```
  * По соглашению использует метод delete request

Можно переопределять как сами операции, так и поля внутри операции (url, request). Можно добавлять новые операции.
  Поле операции _request_ - это функция, которая принимает данные из клиентского вызова и возвращает promise:
  ```javascript
  function(data) { return promise}
  ```

  ### Reducers по умолчанию
  Redux-redents предоставляет функцию, которая принимает словарь конфигурации Entities (поле entities в конфигурации)  и возвращает словарь reducers для операций _index_ и _get_ для каждой entity, которая является ключом в переданном словаре.

  ```javascript
  dictionary_reducers({ent1:{},ent2{}})
  produces
  {
    ent1 : function(state,action), //get ent1
    ent1s : function(state,action), //index ent1
    ent2 : function(state,action), //get ent2
    ent2s : function(state,action), //index ent2
  }
  ```

  ### Actions creator для promise
  Для запуска actions, которые будут получать данные с сервера Redux-redents предоставляет функцию entityOperation
  ```javascript function entityOperation(entity,operation,data,chainlink) ```
  * _entity_ - имя entity, над которой выполняется операция
  * _operation_ - operation имя операции, которую нужно выполнить
  * _data_ - необязательные данные, необходимые для операции. По соглашения data используется в следующих операциях:
    *	'get' - добавляется к url - `url/id`
    *	'post' - отправляется в теле запроса (request body)
    *	'delete' - добавляется к url - `url/id`
  * _chainlink_ - необязательный action, который будет выполнен по завершению обработки текущего. Это функция, в которую будет передано поле action.res или action целиком, если она не содержит поля .res

  ### Promise Middleware
  Promise Middleware принимает action, которая содержит promise, изменяет тип исходного action (новый тип = тип+'_REQUEST') и маршрутизирует измененный action. Так же добавляет
  * обработчик к promise, который маршрутизирует оригинальный action с ответом сервера в поле _res_
  * обработчик ошибок


  ### Chain Middleware
  Если необходимо вызвать action после обработки текущего, то можно воспользоваться _chainlink_ параметром в вызове entityOperation. _chainlink_ - это функция, которая принимает один параметр.
  * chainMiddleware вызывает _chainlink_ только в том, случае если обрабатываемый action содержит поле status со значением 'done' (action.status=='done')
  * chainMiddleware передает ответ сервера (action.res) или action целиком, если ответ не существует в текущем action

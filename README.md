# S.A.M. Sistema de Agendamento Modular

[<img src="logo.png">](https://www.npmjs.com/package/@r2ttecnologia/sam) &nbsp;&nbsp; [<img src="github.png">](https://github.com/r2ttecnologia)

## Português 🇧🇷

> [English 🇺🇸](#english-)

### Introdução

Módulo desenvolvido em NodeJS, permite a abstração de detalhes sobre gerenciamento de agenda e eventos. Pode ser utilizado em qualquer sistema no ambiente nodejs, por exemplo, sistemas de clínicas, eventos, agendas pessoais, etc.

### Como usar? 🤔

> Instalação

```sh
    npm i -S @r2ttecnologia/sam
``` 

> Utilização

```js
    const sam = require('@r2ttecnologia/sam');
```

### Métodos

> createManager()

Cria um gerenciador para os horários

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente | true |
| schedule | Array com os dias da semana | true |
| custom | Dados personalizados do gerenciador | false |

```js
sam.createManager({
   managerid: 1,
   schedule: [{
       init: "12:00",
       end: "16:00"
   }, {
       init: "12:00",
       end: "16:00"
   }, {
       init: "12:00",
       end: "16:00"
   }, {
       init: "12:00",
       end: "16:00"
   }, {
       init: "12:00",
       end: "16:00"
   }, {
       init: "12:00",
       end: "16:00"
   }, {
       init: "14:00",
       end: "16:00"
   }],
   custom: {
       name: "Cool"
   }
}, callback)
```

> createOperator()

Cria um operador dentro do sistema.

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente | true |
| operatorid | Identificação do operador | true |
| busyTime | Array representando os dias da semana com os horários indisponíveis | true |
| custom | Dados personalizados do operador | false |


```js
sam.createOperator({
   managerid: 1,
   operatorid: 20,
   busyTime: [["13:30"], [], [], ["12:30"], [], [], []],
   custom:{
       cool:true
   }
}, callback);
```

> updateOperator()

Atualiza os dados do operador

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente | true |
| operatorid | Identificação do operador | true |
| busyTime | Array representando os dias da semana com os horários indisponíveis | true |
| custom | Dados personalizados do operador | false |

```js
sam.updateOperator({
   managerid: 1,
   operatorid: 10,
   busyTime: [[], ["14:00"], [], ["12:30"], [], [], []],
   custom: {
       type: "Retorno"
   }
}, callback)
```

> selectEvents()

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente de tempo | cond* |
| userid | Identificação do usuário | cond* |
| operatorid | Identificação do operador | cond* |
| init | Data de início | true |
| end | Data de fim | true |

_*cond**: Ao menos uma das propriedades deve ser especificada._

```js
sam.selectEvents({
   managerid: 1,
   userid: 2,
   operatorid: 9,
   init: "2018-02-01",
   end: "2018-01-29",
}, callback)
```

> deleteEvent()

Remove um evento do sistema.

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| operatorid* | Identificação do operador | true |
| date | Data do evento a ser removido | true |

_*operatorid*: Pode ser tanto o id do operador (spoke no nosso caso), como o id o user_

```js
sam.deleteEvent({
   operatorid: 9, 
   date: "2018-03-01T13:00",
}, callback)
```

> removeOperator()

Remove um operador do sistema.

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente de tempo | true |
| operatorid | Identificação do operador | true |

```js
sam.removeOperator({
   operatorid: 20,
   managerid: 1,
}, callback)
```

> selectAvailableTimes()

Seleciona os momentos disponíveis.

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente de tempo | true |
| operatorid | Identificação do operador | true |
| init | Data de início | true |
| end | Data final | true |

```js
sam.selectAvailableTimes({
   managerid: 1,
   operatorid: 10, //opcional
   init: "2018-03-01",
   end: "2018-03-01",
}, callback)
```

> createEvent()

Cria um evento no sistema

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente de tempo | true |
| userid | Identificação do usuário | true |
| operatorid | Identificação do operador | true |
| date | Data de inicio do evento | true |
| custom | Dados perssonalizados | false |

```js
sam.createEvent({
   managerid: 1,
   operatorid: 10,
   userid: 4,
   date: "2018-03-01T13:30:00Z",
   custom: { //opcional
        legal: true
   }
}, callback)
```

> updateEvent()

Reagenda um evento no sistema.

| PARÂMETRO | DESCRIÇÃO | OBRIGATÓRIO |
|-----------|-----------|-------------|
| managerid | Identificação do gerente de tempo | true |
| userid | Identificação do usuário | true |
| operatorid | Identificação do operador | true |
| datePrev | Data de anterior do evento | true |
| date | Data de atual do evento | true |
| custom | Dados perssonalizados | false |

```js
sam.updateEvent({
   managerid: 1,
   operatorid: 10,
   userid: 4,
   datePrev: "2018-03-01T14:00:00Z",
   date: "2018-03-01T13:30:00Z",
   custom: { //opcional
        legal: false
   }
}, callback)
```
___

## English 🇺🇸

> [Portugês 🇧🇷](#português-)

### Introduction

### How to use? 🤔

> Install

```sh
    npm i -S @r2ttecnologia/sam
``` 

> Use

```js
    const sam = require('@r2ttecnologia/sam');
```
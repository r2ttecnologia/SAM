#!/usr/bin/env node

process.env.TZ = "UTC";

var lib = require('../lib/index.js');

/*lib.createManager({
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
}, callback)*/

/*lib.createOperator({
    managerid: 1,
    operatorid: 20,
    busyTime: [["13:30"], [], [], ["12:30"], [], [], []]
}, callback);*/

/*lib.updateOperator({
    managerid: 1,
    operatorid: 10,
    busyTime: [[], ["14:00"], [], ["12:30"], [], [], []],
    custom: {
        type: "Retorno"
    }
}, callback)*/

/*lib.selectEvents({
    managerid: 1,
    userid: 2,
    operatorid: 9,
    init: "2018-02-01",
    end: "2018-01-29",
}, callback)*/

/*lib.deleteEvent({
    operatorid: 9,
    date: "2018-03-01T13:00",
}, callback)*/

/*lib.removeOperator({
    operatorid: 20,
    managerid: 1,
}, callback)*/

/*lib.selectAvailableTimes({
    managerid: 1,
    operatorid: 10,
    init: "2018-03-01",
    end: "2018-03-01",
}, callback)*/

/*lib.createEvent({
    managerid: 1,
    operatorid: 10,
    userid: 4,
    date: "2018-03-01T13:30:00Z",
}, callback)*/

/*lib.updateEvent({
    managerid: 1,
    operatorid: 10,
    userid: 4,
    datePrev: "2018-03-01T14:00:00Z",
    date: "2018-03-01T13:30:00Z",
}, callback)*/

function callback(res) {
    console.log(JSON.stringify(res));
    process.exit(1);
}

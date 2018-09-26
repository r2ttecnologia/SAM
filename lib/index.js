process.env.TZ = "UTC";
const uuidV4 = require('uuid/v4');
const fs = require("fs");
var obj = JSON.parse(fs.readFileSync('configs.json', 'utf8'));
const MongoClient = require('mongodb').MongoClient,
	dbconn = "mongodb://" + obj.user + ":" + obj.pass + "@" + obj.host + "/" + obj.db;

exports.createManager = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			var times = [[], [], [], [], [], [], []];
			for (var i = 0; i < params.schedule.length; i++) {
				var init = new Date("2018-01-01T" + params.schedule[i].init + ":00Z");
				var end = new Date("2018-01-01T" + params.schedule[i].end + ":00Z");
				while (init <= end) {
					times[i].push(((init.getHours() < 10 ? ("0" + init.getHours()) : init.getHours()) + ":" + (init.getMinutes() < 10 ? ("0" + init.getMinutes()) : init.getMinutes())));
					init.setMinutes(init.getMinutes() + +obj.time);
				}
			}
			var query = {
				managerid: params.managerid,
				operators: params.operator || [],
				schedules: times,
				custom: params.custom,
			}
			if (params.loc) query.loc = {
				type: "Point",
				coordinates: params.loc
			}
			mongo.db(obj.db).collection(obj.manager).insert(query, (err, data) => {
				if (err || !data) res({
					code: -1,
					message: "Error creating manager",
					err: err
				})
				else res({
					code: 0,
					message: "Manager created successfully"
				})
			})
		}
	});
}

exports.updateManager = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			var times = [[], [], [], [], [], [], []];
			for (var i = 0; i < params.schedule.length; i++) {
				var init = new Date("2018-01-01T" + params.schedule[i].init + ":00Z");
				var end = new Date("2018-01-01T" + params.schedule[i].end + ":00Z");
				while (init <= end) {
					times[i].push(((init.getHours() < 10 ? ("0" + init.getHours()) : init.getHours()) + ":" + (init.getMinutes() < 10 ? ("0" + init.getMinutes()) : init.getMinutes())));
					init.setMinutes(init.getMinutes() + +obj.time);
				}
			}
			var query = {
				schedules: times
			}
			mongo.db(obj.db).collection(obj.manager).update({
				managerid: params.managerid
			}, {
				$set: query
			}, (err, data) => {
				if (err || !data) res({
					code: -1,
					message: "Error creating manager",
					err: err
				})
				else res({
					code: 0,
					message: "Manager created successfully"
				})
			})
		}
	});
}

exports.createOperator = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			mongo.db(obj.db).collection(obj.manager).update({
				managerid: params.managerid,
			}, {
				$push: {
					operators: {
						operatorid: params.operatorid,
						busyTime: params.busyTime,
						custom: params.custom
					}
				}
			}, (err, data) => {
				if (err) res({
					code: -1,
					message: "Error creating operator",
					err: err
				})
				else res({
					code: 0,
					message: "Operator created successfully"
				})
			})
		}
	});
}

exports.updateOperator = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			mongo.db(obj.db).collection(obj.manager).update({
				managerid: params.managerid,
				'operators.operatorid': params.operatorid
			}, {
				$set: {
					'operators.$': {
						operatorid: params.operatorid,
						busyTime: params.busyTime,
						custom: params.custom
					}
				}
			}, (err, data) => {
				if (err || data.result.n == 0) res({
					code: -1,
					message: "Error updating operator",
					err: err
				})
				else res({
					code: 0,
					message: "Operator updated successfully"
				})
			})
		}
	});
}

exports.removeOperator = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			mongo.db(obj.db).collection(obj.manager).update({
				managerid: params.managerid,
			}, {
				$pull: {
					operators: {
						operatorid: params.operatorid,
					}
				}
			}, (err, data) => {
				if (err || data.result.n == 0) res({
					code: -1,
					message: "Error removing operator",
					err: err
				})
				else res({
					code: 0,
					message: "Operator removed successfully"
				})
			})
		}
	});
}

exports.createEvent = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			if (!params.managerid || !params.operatorid || !params.userid) res({
				code: -1,
				message: "Incomplete information"
			})
			if (!params.date) res({
				code: -1,
				message: "Incomplete date"
			});
			var filter = {
				$project: {
					schedules: 1,
					operators: {
						$filter: {
							input: "$operators",
							as: "item",
							cond: {
								$eq: ["$$item.operatorid", params.operatorid]
							}
						}
					}
				}
			}
			mongo.db(obj.db).collection(obj.manager).aggregate({
				$match: {
					managerid: params.managerid
				}
			}, filter, (err, data) => {
				if (err || !data) res({
					code: -1,
					message: "Error selecting available times",
					err: err
				})
				else {
					var response = [];
					var date = new Date(params.date);
					var text = ((date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()));
					var weekDay = date.getDay();
					var week;
					var ind = 0;
					data.each((err, register) => {
						if (register) {
							for (var g = 0; g < register.operators[0].busyTime[weekDay].length; g++) {
								if (register.operators[0].busyTime[weekDay][g] == text) {
									ind = 1;
									break;
								}
							}
							week = register;
							if (!register.schedules[weekDay].includes(text)) ind = 1;
						} else {
							if (ind == 0) {
								var query = {
									$or: [{
										managerid: params.managerid,
										operatorid: params.operatorid,
										date: new Date(params.date)
								}, {
										userid: params.userid,
										date: new Date(params.date)
									}]
								}
								mongo.db(obj.db).collection(obj.event).count(query, (err, data) => {
									if (err) res({
										code: -1,
										message: "Error selecting busy times",
										err: err
									})
									else {
										if (data > 0) res({
											code: -1,
											message: "Busy time",
										})
										else {
											var eventid = uuidV4();
											var query = {
												managerid: params.managerid,
												operatorid: params.operatorid,
												userid: params.userid,
												eventid: eventid,
												date: date,
												createdAt: new Date(),
												init: text,
												weekDay: weekDay,
											}
											if (params.custom) query.custom = params.custom;
											if (params.expire) {
												console.log(params.expire);
												query.expireAt = params.expire;
											} else if (obj.expire) {
												console.log(obj.expire);
												var expire = new Date(params.date);
												expire.setDate(expire.getDate() + obj.expire);
												query.expireAt = expire;
											}
											mongo.db(obj.db).collection(obj.event).insert(query, (err, data) => {
												if (err) res({
													code: -1,
													message: "Busy time",
												})
												else res({
													code: 0,
													message: "Event created successfully",
													eventid: eventid
												})
											})
										}
									}
								})
							} else res({
								code: -1,
								message: "Busy time",
							})
						}
					});
				}
			})
		}
	});
}

exports.updateEvent = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			if (!params.managerid || !params.operatorid || !params.userid) res({
				code: -1,
				message: "Incomplete information"
			})
			if (!params.date) res({
				code: -1,
				message: "Incomplete date"
			});
			var filter = {
				$project: {
					schedules: 1,
					operators: {
						$filter: {
							input: "$operators",
							as: "item",
							cond: {
								$eq: ["$$item.operatorid", params.operatorid]
							}
						}
					}
				}
			}
			mongo.db(obj.db).collection(obj.manager).aggregate({
				$match: {
					managerid: params.managerid
				}
			}, filter, (err, data) => {
				if (err || !data) res({
					code: -1,
					message: "Error selecting available times",
					err: err
				})
				else {
					var response = [];
					var date = new Date(params.date);
					var text = ((date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()));
					var weekDay = date.getDay();
					var week;
					var ind = 0;
					data.each((err, register) => {
						if (register) {
							for (var g = 0; g < register.operators[0].busyTime[weekDay].length; g++) {
								if (register.operators[0].busyTime[weekDay][g] == text) {
									ind = 1;
									break;
								}
							}
							week = register;
							if (!register.schedules[weekDay].includes(text)) ind = 1;
						} else {
							if (ind == 0) {
								var query = {
									managerid: params.managerid,
									operatorid: params.operatorid,
									date: new Date(params.date),
									datePrev: new Date(params.datePrev)
								}
								mongo.db(obj.db).collection(obj.event).count(query, (err, data) => {
									if (err) res({
										code: -1,
										message: "Error selecting busy times",
										err: err
									})
									else {
										if (data > 0) res({
											code: -1,
											message: "Busy time",
										})
										else {
											var query = {
												date: new Date(params.date),
												updatedAt: new Date(),
												init: text,
												weekDay: weekDay
											}
											if (params.custom) query.custom = params.custom;
											if (obj.expire) {
												var expire = new Date(params.date);
												expire.setDate(expire.getDate() + obj.expire)
												query.expireAt = expire;
											}
											mongo.db(obj.db).collection(obj.event).update({
												managerid: params.managerid,
												operatorid: params.operatorid,
												userid: params.userid,
												date: new Date(params.datePrev)
											}, {
												$set: query
											}, (err, data) => {
												if (err) res({
													code: -1,
													message: "Busy time",
												})
												else res({
													code: 0,
													message: "Event updated successfully",
												})
											})
										}
									}
								})
							} else res({
								code: -1,
								message: "Busy time",
							})
						}
					});
				}
			})
		}
	});
}

exports.updateCustomEvent = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			if (!params.managerid || !params.operatorid || !params.userid) res({
				code: -1,
				message: "Incomplete information"
			})
			mongo.db(obj.db).collection(obj.event).update({
				managerid: params.managerid,
				operatorid: params.operatorid,
				userid: params.userid,
				date: new Date(params.date)
			}, {
				$set: {
					custom: params.custom
				}
			}, (err, data) => {
				if (err) res({
					code: -1,
					message: "Busy time",
				})
				else res({
					code: 0,
					message: "Event updated successfully",
				})
			})
		}
	});
}

exports.selectEvents = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {

		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			if (!params.userid && !params.managerid && !params.operatorid) {
				console.log(params.userid);
				console.log(params.managerid);
				console.log(params.operatorid);
				res({
					code: -1,
					message: "Incomplete information"
				})
				return false;
			}
			var query = {};
			var filter = params.filter ? {
				projection: params.filter
			} : {};
			if (params.userid) query.userid = params.userid;
			if (params.managerid) query.managerid = params.managerid;
			if (params.operatorid) query.operatorid = params.operatorid;
			if (params.custom)
				for (var i in params.custom) query["custom." + i] = params.custom[i];
			if (params.$or) query.$or = params.$or;
			if (!params.init && !params.end) res({
				code: -1,
				message: "Incomplete dates"
			});
			query.$and = [{
				date: {
					$gte: new Date(params.init + "T00:00:00Z")
				}
			}, {
				date: {
					$lte: new Date(params.end + "T23:59:59Z")
				}
			}]
			console.log(query)
			mongo.db(obj.db).collection(obj.event).find(query, filter, (err, data) => {
				if (err || !data) res({
					code: -1,
					message: "Error returning events",
					err: err
				})
				else {
					var response = [];
					data.each((err, register) => {
						if (register) response.push(register);
						else res({
							code: 0,
							message: "Returning events",
							data: response
						})
					});
				}
			})
		}
	});
}

exports.deleteEvent = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			if (!params.userid && !params.operatorid) res({
				code: -1,
				message: "Incomplete information"
			});
			if (!params.date) res({
				code: -1,
				message: "Incomplete date"
			});
			var query = {};
			if (params.userid) query.userid = params.userid;
			if (params.operatorid) query.operatorid = params.operatorid;
			if (params.custom) query.custom = params.custom;
			query.date = new Date(params.date + ":00Z")
			mongo.db(obj.db).collection(obj.event).remove(query, (err, data) => {
				if (err || data.result.n == 0) res({
					code: -1,
					message: "Error removing event",
					err: err
				})
				else res({
					code: 0,
					message: "Event removed successfully"
				})

			})
		}
	});
}

exports.selectAvailableTimes = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			if (!params.managerid) res({
				code: -1,
				message: "Incomplete information"
			})
			if (!params.init || !params.end) res({
				code: -1,
				message: "Incomplete dates"
			});
			var filter = {
				$project: {
					schedules: 1
				}
			}
			if (params.operatorid) filter.$project.operators = {
				$filter: {
					input: "$operators",
					as: "item",
					cond: {
						$eq: ["$$item.operatorid", params.operatorid]
					}
				}
			}
			else filter.$project.operators = 1;
			mongo.db(obj.db).collection(obj.manager).aggregate({
				$match: {
					managerid: params.managerid
				}
			}, filter, (err, data) => {
				if (err || !data) res({
					code: -1,
					message: "Error selecting available times",
					err: err
				})
				else {
					var busyWeek = [[], [], [], [], [], [], []];
					var week;
					data.each((err, register) => {
						if (register) {
							for (var i = 0; i < register.operators.length; i++)
								for (var j = 0; j < 7; j++)
									for (var g = 0; g < register.operators[i].busyTime[j].length; g++) busyWeek[j][register.operators[i].busyTime[j][g]] = (busyWeek[j][register.operators[i].busyTime[j][g]] ? (busyWeek[j][register.operators[i].busyTime[j][g]] + 1) : 1);
							week = register;
						} else {
							var response = [];
							var init = new Date(params.init);
							var weekDay = init.getDay();
							var end = new Date(params.end);
							while (init <= end) {

								response.push({
									weekDay: weekDay,
									schedules: week.schedules[weekDay].slice(),
									date: init.toISOString().split("T")[0]
								});
								init.setDate(init.getDate() + 1);
								weekDay = weekDay == 6 ? 0 : ++weekDay;
							}
							var query = {
								managerid: params.managerid,
								$and: [{
									date: {
										$gte: new Date(params.init)
									}
								}, {
									date: {
										$lte: new Date(params.end + "T23:59:59Z")
									}
								}]
							}
							if (params.operatorid) query.operatorid = params.operatorid;
							mongo.db(obj.db).collection(obj.event).find(query, {
								projection: {
									init: 1,
									end: 1,
									weekDay: 1,
									date: 1
								}
							}, (err, data) => {
								if (err) res({
									code: -1,
									message: "Error selecting busy times",
									err: err
								})
								else {
									var busyMonth = [[], [], [], [], [], [], []];
									data.each((err, event) => {
										if (event) {
											var dateEvent = new Date(event.date).toISOString();
											busyMonth[event.weekDay][dateEvent] = (busyMonth[event.weekDay][dateEvent] ? (busyMonth[event.weekDay][dateEvent] + 1) : 1);
										} else {
											for (var i = 0; i < response.length; i++)
												for (var j = 0; j < response[i].schedules.length; j++) {
													if (busyWeek[response[i].weekDay][response[i].schedules[j]] == week.operators.length) delete response[i].schedules[j];
													else if (((busyMonth[response[i].weekDay][response[i].date + "T" + response[i].schedules[j] + ":00.000Z"] || 0) + (busyWeek[response[i].weekDay][response[i].schedules[j]] || 0)) == week.operators.length) delete response[i].schedules[j];
												}
											res({
												code: 0,
												message: "Returning availabe times",
												data: response
											})
										}
									})
								}
							})
						}
					});
				}
			})
		}
	});
}

exports.selectEventInfo = function (params, res) {
	MongoClient.connect(dbconn, (err, mongo) => {
		if (err) res({
			code: -1,
			message: "Error connecting database",
			err: err
		})
		else {
			if (!params.userid && !params.managerid && !params.operatorid) res({
				code: -1,
				message: "Incomplete information"
			})
			var query = {
				$match: {
					eventid: params.eventid
				}
			};
			if (params.userid) query.$match.userid = params.userid;
			if (params.managerid) query.$match.managerid = params.managerid;
			if (params.operatorid) query.$match.operatorid = params.operatorid;

			mongo.db(obj.db).collection(obj.event).aggregate(query, {
				$lookup: {
					from: "identification",
					localField: "userid",
					foreignField: "userid",
					as: "user"
				}
			}, (err, data) => {
				if (err || !data) res({
					code: -1,
					message: "Error returning events",
					err: err
				})
				else {
					var response = [];
					data.each((err, register) => {
						if (register) response.push(register);
						else res({
							code: 0,
							message: "Returning event",
							data: response
						})
					});
				}
			})
		}
	});
}

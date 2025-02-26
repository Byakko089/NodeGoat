#!/usr/bin/env nodejs

"use strict";

// This script initializes the database. You can set the environment variable
// before running it (default: development). ie:
// NODE_ENV=production node artifacts/db-reset.js

var _ = require("underscore");
var MongoClient = require("mongodb").MongoClient;

var USERS_TO_INSERT = [
    {
        "_id": 1,
        "userName": "admin",
        "firstName": "Node Goat",
        "lastName": "Admin",
        "password": "Admin_123",
        //"password" : "$2a$10$8Zo/1e8KM8QzqOKqbDlYlONBOzukWXrM.IiyzqHRYDXqwB3gzDsba", // Admin_123
        "isAdmin": true
    }, {
        "_id": 2,
        "userName": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "benefitStartDate": "2030-01-10",
        "password": "User1_123"
        // "password" : "$2a$10$RNFhiNmt2TTpVO9cqZElb.LQM9e1mzDoggEHufLjAnAKImc6FNE86",// User1_123
    }, {
        "_id": 3,
        "userName": "user2",
        "firstName": "Will",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User2_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }];

    /*
const tryDropCollection = (db, name) => {
    return new Promise((resolve, reject) => {
        db.dropCollection(name, (err, data) => {
            if (!err) {
                console.log(`Dropped collection: ${name}`);
            }
            resolve(undefined);
        });
    });
}*/

// Getting the global config taking in account he environment (proc)
var config = require("../config/config");

function parseResponse (err, res, comm) {
    if (err) {
        console.log("ERROR:");
        console.log(comm);
        console.log(JSON.stringify(err));

        process.exit(1);
    }
    console.log(comm);
    console.log(JSON.stringify(res));
}


// Starting here
MongoClient.connect(db, function(err, db) {
    var usersCol, allocationsCol, countersCol;

    if (err) {
        console.log("ERROR: connect");
        console.log(JSON.stringify(err));
    }
    console.log("Connected to the database: " + config.db);

    /*const collectionNames = [
        "users",
        "allocations",
        "contributions",
        "memos",
        "counters"
    ];*/

    // remove existing data (if any), we don't want to look for errors here
    db.dropCollection("users");
    db.dropCollection("allocations");
    db.dropCollection("contributions");
    db.dropCollection("memos");
    db.dropCollection("counters");

    usersCol = db.collection("users");
    allocationsCol = db.collection("allocations");
    countersCol = db.collection("counters");

        // reset unique id counter
        countersCol.insert({
            _id: "userId",
            seq: 3
        });

        // insert admin and test users
        console.log("Users to insert:");
        USERS_TO_INSERT.forEach(function(user) {
        console.log(JSON.stringify(user));
        });

        usersCol.insertMany(USERS_TO_INSERT, function(err, data) {
            var finalAllocations = [];
            var ids;

            // We can't continue if error here
            if (err) {
                console.log("ERROR: insertMany");
                console.log(JSON.stringify(err));
    
                process.exit(1);
            }
            parseResponse(err, data, "users.insertMany");
    
            data.ops.forEach(function(user) {
                var stocks = Math.floor((Math.random() * 40) + 1);
                var funds = Math.floor((Math.random() * 40) + 1);
    
                finalAllocations.push({
                    userId: user._id,
                    stocks: stocks,
                    funds: funds,
                    bonds: 100 - (stocks + funds)
                });
            });
    
            console.log("Allocations to insert:");
            finalAllocations.forEach(function(allocation) {
                console.log(JSON.stringify(allocation));
            });
    
            allocationsCol.insertMany(finalAllocations, function(err, data) {
                parseResponse(err, data, "allocations.insertMany");
                process.exit(0);
            });
    
        });
    });
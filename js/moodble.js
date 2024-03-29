// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, connectButton */
/* global detailPage, resultDiv, rgbString, sendButton, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
// 'use strict';

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// this is Nordic's UART service
var bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};

var app = {

    initialize: function() {
        this.bindEvents();
        detailPage.hidden = false;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        connectButton.addEventListener('touchstart', this.scanForDevice, false);
        moodButton.addEventListener('click', this.sendMood, false);
        sparkleButton.addEventListener('click', this.starkSparkle, false)


        // disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function() {
        app.scanForDevice();
    },
     scanForDevice: function() {
        deviceList.innerHTML = 'Click to connect to Ring'; // empties the list
        ble.scan([bluefruit.serviceUUID], 5, app.onDiscoverDevice, app.onError);
        // if Android can't find your device try scanning for all devices
        // ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

        device.id = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F"; //insert correct device id 
        // 0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F - white
        // 3FC0C51F-3ADE-C861-AD69-C7E74BA4E6A6 - grey
        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },

    connect: function(e) {
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F", //insert correct device id
            onConnect = function(peripheral) {
                app.determineWriteType(peripheral);

                // subscribe for incoming data
                ble.startNotification(deviceId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
                sendButton.dataset.deviceId = deviceId;
                // disconnectButton.dataset.deviceId = deviceId;
                resultDiv.innerHTML = "";
            };

        ble.connect(deviceId, onConnect, app.onError);

    },


    determineWriteType: function(peripheral) {
        // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
        // Newer Bluefruit devices use Write Request for the TX characteristic

        var characteristic = peripheral.characteristics.filter(function(element) {
            if (element.characteristic.toLowerCase() === bluefruit.txCharacteristic) {
                return element;
            }
        })[0];

        if (characteristic.properties.indexOf('WriteWithoutResponse') > -1) {
            app.writeWithoutResponse = true;
        } else {
            app.writeWithoutResponse = false;
        }

    },


    onData: function(data) { // data received from necklace
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },

//need to finish writing this 

    starkSparkle: function(event) { //send empty string to initiate sparkle
        
        var success = function() {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sparkling: " + sparkleInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function () {
            alert("Having trouble sparkling right now. Please check your bluetooth connection and try again.");
        }
    }

// How to handle color data 

sendMood: function(event) { // send mood data to necklace


        var success = function() {

            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Mood, updated: " + moodInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed sending mood to necklace. But don't fret. Just check your settings to make sure your bluetooth connection was successful ;)");
        };

        var mood = stringToBytes('E' + moodInput.value);
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F";

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                mood, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                mood, success, failure
            );
        }
    },

onError: function(reason) {
        alert("ERROR: " + JSON.stringify(reason)); // real apps should use notification.alert
    },
};

// 
    
app.initialize();




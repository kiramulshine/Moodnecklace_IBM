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
        enjoymentButton.addEventListener('click', this.sendEnjoyment, false);
        sadnessButton.addEventListener('click', this.sendSadness, false);
        disgustButton.addEventListener('click', this.sendDisgust, false);
        fearButton.addEventListener('click', this.sendFear, false);
        angerButton.addEventListener('click', this.sendAnger, false);


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

        device.id = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F"; 
        // 0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F - white
        // 3FC0C51F-3ADE-C861-AD69-C7E74BA4E6A6 - grey
        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },

    connect: function(e) {
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F",
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


onData: function(data) { // data received from ring
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },

sendEnjoyment: function(event) { // send enjoyment data to ring


        var success = function() {

            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Enjoyment, mapped: " + enjoymentInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed sending enjoyment to ring. Check your settings to make sure you connected to your ring via bluetooth ;)");
        };

        var enjoy = stringToBytes('E' + enjoymentInput.value);
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F";

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                enjoy, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                enjoy, success, failure
            );
        }
    },
sendSadness: function(event) { // send sadness data to ring


        var success = function() {

            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sadness, mapped: " + sadnessInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed sending sadness to ring. Check your settings to make sure you connected to your ring via bluetooth ;)");
        };

        var sadness = stringToBytes("S" + sadnessInput.value);
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F";

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                sadness, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                sadness, success, failure
            );
        }
    },

sendDisgust: function(event) { // send disgust data to ring


        var success = function() {

            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Disgust, mapped: " + disgustInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed sending disgust to ring. Check your settings to make sure you connected to your ring via bluetooth ;)");
        };

        var disgust = stringToBytes("D" + disgustInput.value);
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F";

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                disgust, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                disgust, success, failure
            );
        }
    },

sendFear: function(event) { // send fear data to ring


        var success = function() {

            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Fear, mapped: " + fearInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed sending fear to ring. But stay calm! All you need to do is check your settings to make sure you connected to your ring via bluetooth ;)");
        };

        var fear = stringToBytes("F" + fearInput.value);
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F";

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                fear, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                fear, success, failure
            );
        }
    },

sendAnger: function(event) { // send anger data to ring



        var success = function() {

            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Anger, mapped: " + angerInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed sending anger to ring. But stay calm! All you need to do is check your settings to make sure you connected to your ring via bluetooth ;)");
        };

        var anger = stringToBytes("A" + angerInput.value);
        var deviceId = "0E2EAC28-BD71-C5CE-ECB6-C52F44672D7F";

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                anger, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                anger, success, failure
            );
        }
    },

onError: function(reason) {
        alert("ERROR: " + JSON.stringify(reason)); // real apps should use notification.alert
    }
};

// 
    
app.initialize();




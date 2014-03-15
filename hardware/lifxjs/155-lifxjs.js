/**
 * Copyright 2014 Alec Clews
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var RED = require(process.env.NODE_RED_HOME+"/red/red");
var lifx = require("lifx");
// create a single global lifxjs object

var lifxjs = null;

function lifxjsNode(n) {
    RED.nodes.createNode(this,n);
    this.stateto = Number(n.stateto) || 0;
    var node = this;

    try {
        this.on("input", function(msg) {
            lifxjs = lifxjs || new lifx.init();
            if (lifxjs) {
                if (msg.payload == 0) { lifxjs.lightsOff(); }
                else if (msg.payload == '1') { lifxjs.lightsOn(); }
                else { node.warn("lifxjs : invalid msg : "+msg.payload); }
            }
            else { node.warn("lifxjs : not found");
            }
        });

        this.on("close", function() {
            if (lifxjs ) {
                lifxjs.lightOff(); //This ought to work but seems to cause more hangs on closing than not...
            }
            lifxjs = null;
        });
    }
    catch(e) {
        node.error("No lifxjs found (" + e + ")");
    }
}
RED.nodes.registerType("lifxjs",lifxjsNode);

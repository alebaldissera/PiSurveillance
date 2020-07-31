#!/usr/bin/node
const ping = require("ping");
const cp = require("child_process");

//configuration file for camera urls
const cameras = require("./cameras.json");
console.log(cameras);

const screen_resolution = [require("./resolution.json").width, require("./resolution.json").height];

let onlineCameras = new Array();
let offlineCameras = new Array();


//a simple function to ping a camera to be sure it is online
const pingIP = async (ip) => {
    return new Promise((res, rej) => {
        ping.sys.probe(ip, (isAlive) => {
            if (isAlive) res(); else rej();
        });
    });
}

//this function spawn omxplayer for a single camera
const startViewCamera = async (c) => {
    try {
        await pingIP(cameras[c].ip);
	console.log(`Camera ${c} is now online (${cameras[c].ip})`);
        let p = cp.exec(cameras[c].command);
        onlineCameras[p.pid] = c;
        p.on("error", (err) => {
            console.log("A PROCESS EXITED");
            let cam = onlineCameras[p.pid];
            delete onlineCameras[p.pid]
            offlineCameras.push(cam);
        });

        p.on("exit", (code, signal) => {
            console.log("A PROCESS EXITED");
            let cam = onlineCameras[p.pid];
            delete onlineCameras[p.pid]
            offlineCameras.push(cam);
        });
    } catch (error) {
        console.log(`Camera ${c} offline (${cameras[c].ip});`);
        offlineCameras.push(c);
    }
}

//main start function
const start = async () => {
    //array of areas for cameras
    let res = new Array();

    //aux values
    let halfX = screen_resolution[0] / 2;
    let halfY = screen_resolution[1] / 2;

    //very bad method :/
    //calculate view area for each camera
    //i think in the future to implement a layout file descriptor
    res[0] = [0, 0, halfX, halfY];
    res[1] = [halfX, 0, screen_resolution[0], halfY];
    res[2] = [0, halfY, halfX, screen_resolution[1]];
    res[3] = [halfX, halfY, screen_resolution[0], screen_resolution[1]];

    //counter for resolutions
    let i = 0;

    //cycle though each camera and create the command than spawn omxplayer
    for (var c in cameras) {
        var command = `omxplayer --no-osd --no-keys ${cameras[c].protocol}://${cameras[c].ip}:${cameras[c].port}/${cameras[c].path} --live --win "${res[i][0]},${res[i][1]},${res[i][2]},${res[i][3]}"`
        cameras[c].command = command;
        i++;
        startViewCamera(c);
    }
}


//a timer to reconnect offline cameras
setInterval(() => {
    while (offlineCameras.length > 0) {
        var c = offlineCameras.pop();
        startViewCamera(c);
    }
}, 10000);

start();

# PISURVEILLANCE

A simple surveillance solution for Raspberry Pi and IP cameras. At the moment this software support a maximum of 4 cameras and it always displays in a 2x2 grid.
This software sould be compatible with every Raspberry Pi but it was tested only on a Raspberry Pi 4 with 4G of RAM.
This software is not compatible with other platform because it uses omxplayer that is available only on Raspberry Pi

## Requirements

- Raspberry Pi (Only tested on Raspberry Pi 4 with 4GB of ram)
- NodeJS installed (See https://github.com/nodesource/distributions/blob/master/README.md for more info on how to install)

## How To Install

- `git clone https://github.com/willyilcojote/pisurveillace.git`
- `cd PiSurveillance && npm install && cd ..`
- `sudo cp -r PiSurveillance /opt/`
- `cd /opt/PiSurveillance`
- `sudo chmod +x app.js`
- `sudo cp PiSurveillance.service /etc/systemd/system/`
- `sudo systemctl enable PiSurveillance.service`
- `sudo reboot`
Soon I will create an installer script.

## How to confiure

Edit with a text editor the file placed in `/opt/pisurvillance/cameras.json` using this schema:
```
{
  "Camera_Name": {
    "ip": "string",
    "port": int,
    "protocol": "string"
    "path": "string"
  },
  ...
}
```
The file cameras.json on the repository contains a configuration example.
Remember that at the moment this software support max 4 cameras.

## How To Run
Just type `/opt/app.js` and hit enter.

## Autostart on os boot
You have to create a new systemd unit, then copy the file on `/etc/systemd/system/` and enable it using systemctl.
Soon I will create the unit file and an auto unit installer.

## Hint with `raspi-config`
- Change default user password
- Disable desktop GUI
- Dedicate at least 256M of memory to the gpu for better performance (memory slpit)
- Enable ssh access, wait for network at boot
- Disable vnc, camera interface and other communication protocol that you don't need.


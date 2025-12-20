# blacksmith
Network inventory and orchestration system

## Overview
Blacksmith is an inventory-centric management system for network devices. Individual devices are treated as first-class objects, allowing for flexibility with network management.

## Setup instructions
    python -m pip install --upgrade pip flask netmiko tinydb ping3
    flask run --host=0.0.0.0

## To Do
[x] Add basic frontend\
[x] Add device tagging functionality (instead of single-membership such as device group)\
[ ] Add help page (wiki-style)\
[ ] Add authentication layer\
[ ] Add dark mode\
[ ] Add feature - device inventory\
[ ] Add feature - device comparison (properties and configuration)\
[ ] Add feature - IPAM\
[ ] Add feature - routing protocols\
[ ] Add feature - opening a device in external systems (SSH, web, monitoring system, etc)\
[ ] Add driver - Cisco IOS\
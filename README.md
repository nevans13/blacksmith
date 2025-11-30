# blacksmith
Network inventory and orchestration system

## Overview
Blacksmith is an inventory-centric management system for network devices. Individual devices are treated as first-class objects, allowing for flexibility with network management.

## Setup instructions
    python -m pip install --upgrade pip flask netmiko tinydb
    flask run --host=0.0.0.0

## To Do
    [x] Add basic frontend
    [ ] Add device tagging functionality (instead of single-membership such as device group)
    [ ] Add authentication layer
    [ ] Add dark mode
    [ ] Add feature - device inventory
    [ ] Add feature - device comparison
    [ ] Add feature - IPAM
    [ ] Add feature - routing protocols
    [ ] Add feature - opening a device in external systems (SSH, web, monitoring system, etc)
    [ ] Add driver - Cisco IOS
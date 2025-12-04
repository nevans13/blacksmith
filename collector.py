# blacksmith device collector and network scanner
# v1.0.0 - 10/12/2025
# nevans13

from ping3 import ping
from tinydb import TinyDB, Query

# Given a list of device IP addresses, return a bool of whether or not the device is online
def isOnline(devices):
    if type(devices) != list: raise TypeError("Device list must be of list type")
    if len(devices) < 1: raise ValueError("Device list requires at least one device")

    for device in devices:
        try:
            result = ping(device)
            if result and type(result) == float and result > 0: return True
            else: return False
        except: raise RuntimeError("Error trying to ping device")

#if __name__ == "__main__":
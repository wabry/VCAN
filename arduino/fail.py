'''
Created on 2011-12-02

@author: VCAN

Successful running with Python3
'''

import sys
import serial
import time

# Need to communicate with Ardunio over serial port
ser = serial.Serial("COM3", 9600)

# Sleep for 1.6 seconds to allow asynchronous serial.Serial 
# to finish connecting
time.sleep(1.6)

ser.write('0'.encode())
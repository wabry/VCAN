import sys
import serial
import threading
import atexit
import time
from flask import Flask

# Pool time
POOL_TIME = 0.2

# Global variables
ser = serial.Serial()
serial_open = False
success_bool = False
fail_bool = False

# Lock for variables
dataLock = threading.Lock()
# Thread handler
yourThread = threading.Thread()

# The flask app driver
def create_app():
	app = Flask(__name__)

	def interrupt():
		global yourThread
		yourThread.cancel()

	def doStuff():
		global success_bool, fail_bool
		global yourThread, dataLock
		global ser, serial_open
		# Grab the data lock
		with dataLock:
			# If the serial port is open
			if serial_open:
				if success_bool == True:
					ser.write('1'.encode())
					success_bool = False
				elif fail_bool == True:
					ser.write('0'.encode())
					fail_bool = False
		# Set the next thread to happen
		yourThread = threading.Timer(POOL_TIME, doStuff, ())
		yourThread.start()  

	def doStuffStart():
		# Create your thread
		global yourThread
		yourThread = threading.Timer(POOL_TIME, doStuff, ())
		yourThread.start()

	# Initiate
	doStuffStart()
	# When you kill Flask (SIGTERM), clear the trigger for the next thread
	atexit.register(interrupt)
	return app

# Create the actual app
app = create_app()

# A successful request
@app.route("/success")
def send_success():
   global dataLock, success_bool
   dataLock.acquire()
   success_bool = True
   dataLock.release()
   return("Success sent to neopixel")

# An unsuccessful request
@app.route("/failure")
def send_failure():
   global dataLock, fail_bool
   dataLock.acquire()
   fail_bool = True
   dataLock.release()
   return("Failure sent to neopixel")

# Start
@app.route("/start")
def start():
	global ser, serial_open, dataLock
	dataLock.acquire()
	serial_open = True
	ser = serial.Serial("COM3",9600)
	dataLock.release()
	return "Neopixel serial communication started!"

# Stop
@app.route("/stop")
def stop():
	global ser, serial_open
	dataLock.acquire()
	serial_open = False
	ser.close()
	dataLock.release()
	return "Neopixel serial communication stopped!"

# Home
@app.route("/")
def home():
    return "Welcome to the neopixel server!"

# Driver
if __name__ == "__main__":
	# Start the server on port 3000
	app.run(host='0.0.0.0', port=3000, debug=True)
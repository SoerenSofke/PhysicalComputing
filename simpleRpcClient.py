import time
from simple_rpc import SerialInterface

start = time.time()

with SerialInterface('COM7', wait=0, baudrate=9600) as interface:
    end = time.time()
    print(end - start)

    while True:        
        start = time.time()

        interface.call_method('setColor', 255, 0, 0, 128)
        time.sleep(0.5)

        interface.call_method('setColor', 0, 255, 0, 128)
        time.sleep(0.5)

        interface.call_method('setColor', 0, 0, 255, 128)
        time.sleep(0.5)
        
        end = time.time()
        print(end - start)

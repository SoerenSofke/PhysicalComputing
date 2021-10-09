import time
from simple_rpc import SerialInterface

start = time.time()

with SerialInterface('COM3', wait=0, baudrate=0) as interface:
    end = time.time()
    print(end - start)

    while True:        
        start = time.time()

        interface.call_method('set_led', 0)
        time.sleep(0.5)
        interface.call_method('set_led', 255)
        time.sleep(0.5)

        end = time.time()
        print(end - start)

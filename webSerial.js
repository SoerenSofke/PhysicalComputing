class WebSerial {  
    async init() {
      if ('serial' in navigator) {
        try {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate: 9600 });
                    
          this.reader = port.readable.getReader();
          this.writer = port.writable.getWriter();

          while (port.readable) {
            try {
              while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                  // |reader| has been canceled.
                  break;
                }
                this.value = value
              }
            } catch (error) {
              // Handle |error|...
            } finally {
              reader.releaseLock();
            }
          }
        }
        catch (err) {
          console.error('There was an error opening the serial port:', err);
        }
      }
      else {
        console.error('Web serial doesn\'t seem to be enabled in your browser. Try enabling it by visiting:');
        console.error('chrome://flags/#enable-experimental-web-platform-features');
        console.error('opera://flags/#enable-experimental-web-platform-features');
        console.error('edge://flags/#enable-experimental-web-platform-features');
      }
    }    
  
    async write(dataTx) {      
      return await this.writer.write(dataTx.buffer);
    }    

    async read() {
        const {value, done} = await this.reader.read();
        return value
    }
}

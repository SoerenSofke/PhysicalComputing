class WebSerial {  
    async init() {
      if ('serial' in navigator) {
        try {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate: 9600 });
          
          this.writer = port.writable.getWriter();
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
  }

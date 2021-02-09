function sayHello() {
  if (navigator.userAgent.toLowerCase().indexOf('chrome') !== -1) {
    const args = ['\n %c Template Ready! \n', 'font-size: 54px; font-weight: 900; color: #ff0; background: #000;'];
    console.log.apply(console, args);
  } else if (window.console) {
    console.log('Template Ready!');
  }
}
module.exports = sayHello;
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');
const input = document.querySelector('#datetime-picker');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

startBtn.disabled = true;
let userSelectedDate = null;
let interval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      if (selectedDates[0] <= new Date()){
        startBtn.disabled = true;   
        iziToast.error({
            title: 'Hey!',
            message: 'Please choose a date in the future!',
            position: 'topCenter'
        })
        return;  
      };
        userSelectedDate = selectedDates[0];
        startBtn.disabled = false; 
    },
};

startBtn.addEventListener(`click`, event => {
    startBtn.disabled = true;
    input.disabled = true;
    interval = setInterval(() => {
        const currentTime = Date.now();
        const diff = userSelectedDate - currentTime;
        if (diff <= 0) {
            clearInterval(interval)
            days.textContent = '00';
            hours.textContent = '00';
            minutes.textContent = '00';
            seconds.textContent = '00';  
            input.disabled = false;
            startBtn.disabled = true;
            return
        }
        
        const timer = convertMs(diff);
        days.textContent = addLeadingZero(timer.days);
        hours.textContent = addLeadingZero(timer.hours);
        minutes.textContent = addLeadingZero(timer.minutes);
        seconds.textContent = addLeadingZero(timer.seconds);
    }, 1000)    
}) 

stopBtn.addEventListener(`click`, event => {
    clearInterval(interval);
    days.textContent = "00";
    hours.textContent = '00';
    minutes.textContent = '00';
    seconds.textContent = '00'; 
    userSelectedDate = null;
    startBtn.disabled = true;
    input.disabled = false;
    input.value = ""
}); 


function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(input, options);
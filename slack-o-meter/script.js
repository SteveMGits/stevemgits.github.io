var running = false;

var startTime, annualSalary, isWorkHoursOnly;

async function Sleep(ms)  { return new Promise((resolve) => setTimeout(resolve, ms)); }

function Start() {
    startTime = document.getElementById('start_date').valueAsDate;
    annualSalary = parseFloat(document.getElementById('salary').value);
    running = true;
    var tickRate = document.getElementById('tick_rate').value;
    Run(tickRate);
}

async function Run(tickRate)
{
    if(!startTime)
        startTime = new Date();
    if(!tickRate || !annualSalary || annualSalary < 0)
    {
        return;
    }
    
    await Sleep(tickRate);
    if (running) {
        Tick("pay");
        Run(tickRate);
    }
}

function Stop() {
    running = false;
}

function Tick(spanId) {
    document.getElementById(spanId).innerHTML = 
    CalculateAccruedWages(startTime, new Date(), annualSalary, isWorkHoursOnly);
}

function CalculateAccruedWages(startTime, currentTime, annualSalary, isWorkHoursOnly) {
    var days = 365 + IsLeapYear(startTime.getFullYear());

    var elapsedTime = currentTime - startTime;

    return (elapsedTime / (days * 24 * 60 * 60 * 1000)) * annualSalary;
}

function GetWorkDays(year) {
    var endWholeDay = new Date(year, 0, 52 * 7);

    var extraWorkDays = 0;
    while (endWholeDay < new Date(year + 1, 0, 1)) {
        if (IsWeekday(endWholeDay)) {
            extraWorkDays++;
        }
        endWholeDay.setDate(endWholeDay.getDate() + 1);
    }

    return (52 * 5) + extraWorkDays;
}

function IsWeekday(date) {
    var day = date.getDay();
    return day !== 0 && day !== 6;
}

function IsLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}

var running = false;

var startTime, annualSalary, hourlyWage;

document.addEventListener("DOMContentLoaded", () => {
    ShowHourly(false);
});

// TODO - read from somewhere

async function Sleep(ms)  { return new Promise((resolve) => setTimeout(resolve, ms)); }

function isHourly()
{
    return !document.getElementById("annual_salary").checked;
}

function ChangeSalaryType()
{
    var isHourly = !document.getElementById("annual_salary").checked;

    if(isHourly)
    {
        ShowHourly(true);
        ShowAnnual(false);
    }
        
    else
    {
        ShowHourly(false);
        ShowAnnual(true);
    }
        
}

// TODO - we can refactor this into one method
function ShowHourly(isHourly)
{
    var hourlyElems = document.getElementsByClassName("hourly");

    for(var i = 0; i < hourlyElems.length; i++)
    {
        if(isHourly)
            hourlyElems[i].style.display = "";
        else
            hourlyElems[i].style.display = "none";
    }
}

function ShowAnnual(isAnnual)
{
    var annualElems = document.getElementsByClassName("annual");
    
    for(var i = 0; i < annualElems.length; i++)
    {
        if(isAnnual)
            annualElems[i].style.display = "";
        else
            annualElems[i].style.display = "none";
    }
}

function Start() {
    if(!isHourly())
        startTime = document.getElementById('start_date').valueAsDate;
    
    annualSalary = parseFloat(document.getElementById('salary').value);
    hourlyWage = parseFloat(document.getElementById('wage').value);

    running = true;
    var tickRate = document.getElementById('tick_rate').value;
    Run(tickRate);
}

async function Run(tickRate)
{
    if(!startTime)
        startTime = new Date();
    
    if(!tickRate || 
        (!annualSalary || annualSalary < 0) &&
        (!hourlyWage || hourlyWage < 0))
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

function Reset() {
    Stop();
    startTime = null;
    document.getElementById("pay").innerHTML = "";
}

function Tick(spanId) {
    // TODO - implement reels
    document.getElementById(spanId).innerHTML = 
        CalculateAccruedWages(startTime, new Date());
}

function CalculateAccruedWages(startTime, currentTime) {
    var elapsedTime = currentTime - startTime;
    
    if(isHourly())
    {
        return (elapsedTime / 1000 / 60 / 60) * hourlyWage;
    }
    else 
    {
        var days = 365 + IsLeapYear(startTime.getFullYear());

        return (elapsedTime / (days * 24 * 60 * 60 * 1000)) * annualSalary;
    }
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

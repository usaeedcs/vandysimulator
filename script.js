// Function to update local time
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('local-time');
    const dateElement = document.getElementById('local-date');

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    const formattedTime = now.toLocaleTimeString();

    timeElement.textContent = `Local Time: ${formattedTime}`;
    dateElement.textContent = `Local Date: ${formattedDate}`;
}

// Function to fetch and update weather information using an API (e.g., OpenWeatherMap)
async function updateWeather() {
    const apiKey = 'YOUR_API_KEY'; // Replace with your API key
    const city = 'YourCity'; // Replace with your city name
    const weatherElement = document.getElementById('weather-info');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const weatherData = await response.json();

        const temperature = Math.round(weatherData.main.temp - 273.15); // Convert Kelvin to Celsius
        const weatherDescription = weatherData.weather[0].description;
        const weatherIcon = weatherData.weather[0].icon;

        const weatherText = `Weather: ${weatherDescription}, Temperature: ${temperature}°C`;
        weatherElement.textContent = weatherText;
    } catch (error) {
        weatherElement.textContent = 'Failed to fetch weather data';
    }
}

// Function to update date, time, and weather every second
function updateDateTime() {
    updateTime();
    updateWeather();
}

// Initial call to update date, time, and weather
updateDateTime();

// Update date, time, and weather every second
setInterval(updateDateTime, 1000);

// Get references to form and input elements
const uploadForm = document.getElementById('upload-form');
const datasetInput = document.getElementById('dataset-file');

// Add an event listener for form submission
uploadForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    const file = datasetInput.files[0]; // Get the selected file

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const arrayBuffer = event.target.result;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Assuming your Excel file has one sheet, you can access it like this:
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Now you can work with the sheet data (e.g., convert it to JSON)
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            console.log(jsonData);
        };

        reader.readAsArrayBuffer(file); // Read the file as an array buffer
    }
});

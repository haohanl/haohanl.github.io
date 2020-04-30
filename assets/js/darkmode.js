// https://derekkedziora.com/blog/dark-mode-revisited 
// this checks for session storage telling to override
// the system preferences 
let theme = sessionStorage.getItem('theme');

if (theme === "dark") {
    document.getElementById("darkmode-label").innerHTML = "Dark Mode";
    document.getElementById("darkmode-switch").checked = false;
} else {
    document.getElementById("darkmode-label").innerHTML = "Light Mode";
    document.getElementById("darkmode-switch").checked = true;
}

function modeSwitcher() {
    // it's important to check for overrides again 
    let theme = sessionStorage.getItem('theme');
    // checks if reader selected dark mode 
    if (theme === "dark") {
        document.documentElement.setAttribute('data-theme', 'light');
        sessionStorage.setItem('theme', 'light');
        document.getElementById("darkmode-label").innerHTML = "Light Mode";
        // checks if reader selected light mode 
    } else if (theme === "light") {
        document.documentElement.setAttribute('data-theme', 'dark');
        sessionStorage.setItem('theme', 'dark');
        document.getElementById("darkmode-label").innerHTML = "Dark Mode";
        // checks if system set dark mode 
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        sessionStorage.setItem('theme', 'dark');
        document.getElementById("darkmode-label").innerHTML = "Dark Mode";
    }
}

if (theme === "dark") {
	document.documentElement.setAttribute('data-theme', 'dark');
	sessionStorage.setItem('theme', 'dark');
	document.getElementById("darkmode-label").innerHTML = "Dark Mode";
} else if (theme === "light") {
	document.documentElement.setAttribute('data-theme', 'light');
	sessionStorage.setItem('theme', 'light');
	document.getElementById("darkmode-label").innerHTML = "Light Mode";
}
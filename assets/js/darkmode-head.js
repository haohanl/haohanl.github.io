// https://derekkedziora.com/blog/dark-mode-revisited
// this checks for session storage telling to override
// the system preferences 
let pretheme = sessionStorage.getItem('theme');

if (pretheme === "dark") {
	document.documentElement.setAttribute('data-theme', 'dark');
	sessionStorage.setItem('theme', 'dark');
} else {
	document.documentElement.setAttribute('data-theme', 'light');
	sessionStorage.setItem('theme', 'light');
}
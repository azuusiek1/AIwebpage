const cssLocation: string = "./assets/css/";
let styles: string[][] = [
    ['Fajny Styl','style.css'],
    ['Fajniejszy Styl','style2.css'],
    ['Najfanjniejszy Styl','style2.css']
];
let navigationElement: HTMLDivElement = document.querySelector('.changeStyle') as HTMLDivElement;
const headElement: HTMLHeadElement = document.querySelector('head') as HTMLHeadElement;
function setStyleSheet(sheet: string) {
    const earlierLink = headElement.querySelector("link");
    if(earlierLink) {
        earlierLink.remove();
    }
    const link: HTMLLinkElement = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssLocation + sheet;
    headElement.appendChild(link);
}
/*
            <li><a href="page1.html">Responsive</a></li>
            <li><a href="page2.html">Other</a></li>
            <li><a href="page3.html">No Style</a></li>
*/
function addStyles() {
    for (let style of styles) {
        const link: HTMLLIElement = document.createElement('li');
        link.innerText = style[0];
        link.addEventListener("click", (event) => {
            setStyleSheet(style[1]);
        });
        navigationElement.appendChild(link);
    }
}
setStyleSheet(styles[0][1]);
addStyles();

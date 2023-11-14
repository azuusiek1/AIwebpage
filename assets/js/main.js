let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("splitButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        let table = document.getElementById("table");
        table.textContent = '';
        let index = 1;
        for(i = 1; i<=3; i++) {
            for(j = 1; j<=3; j++) {
                let canvasPart = document.createElement("canvas");
                let xPart = (canvas.width / 3);
                let yPart = (canvas.height / 3);
                canvasPart.height =  (canvas.width / 3);
                canvasPart.width =  (canvas.height / 3);
                canvasPart.setAttribute("puzzleIndex", index);
                canvasPart.setAttribute("id", "draggable-item-"+index);
                canvasPart.setAttribute("draggable", true);
                canvasPart.classList.add("item");
                canvasPart.classList.add("draggable");
                index++;
                let canvasContext = canvasPart.getContext("2d");
                let singleContext = table.appendChild(canvasPart);
                canvasContext.drawImage(canvas, (j-1) * xPart, (i-1) * yPart, xPart, yPart, 0, 0, xPart, yPart);
            }
        }
        //shuffling elements
        var divs = table.children;
        var frag = document.createDocumentFragment();
        while (divs.length) {
            frag.appendChild(divs[Math.floor(Math.random() * divs.length)]);
        }
        table.appendChild(frag);
        refreshDragging();
    });
});
document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

const showNotification = () => {
    if(Notification.permission === 'granted') {
    const notification = new Notification('JavaScript Notification API', {
        body: 'Puzzles done!',
    });

    setTimeout(() => {
        notification.close();
    }, 10 * 1000);

    notification.addEventListener('click', () => {
        // do nothing
    });
}
}
(async () => {
/*
    const showError = () => {
        const error = document.querySelector('.error');
        error.style.display = 'block';
        error.textContent = 'You blocked the notifications';
    }
*/
    let granted = false;

    if (Notification.permission === 'granted') {
        granted = true;
    } else if (Notification.permission !== 'denied') {
        let permission = await Notification.requestPermission();
        granted = permission === 'granted' ? true : false;
    }
    /*
    granted ? showNotification() : showError();
    */
    console.log("notification granted" + granted);
})();
function checkPuzzles() {
    let table = document.getElementById("targetPuzzles");
    let items = table.querySelectorAll('.item');
    let checking = [];
    for (let item of items) {
        checking.push(parseInt(item.getAttribute("puzzleindex")));
    }
    console.log(checking);
    if(arraysEqual(checking,[1,2,3,4,5,6,7,8,9]))
        showNotification();
}
function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}
function refreshDragging() {
    let items = document.querySelectorAll('.item');
    for (let item of items) {
        item.addEventListener("dragstart", function(event) {
            this.style.border = "5px dashed #D8D8FF";
            event.dataTransfer.setData("text", this.id);
        });

        item.addEventListener("dragend", function(event) {
            this.style.borderWidth = "0";
        });
    }

    let targets = document.querySelectorAll(".drag-target");
    for (let target of targets) {
        target.addEventListener("dragenter", function (event) {
            this.style.border = "2px solid #7FE9D9";
        });
        target.addEventListener("dragleave", function (event) {
            this.style.border = "2px dashed #7f7fe9";
        });
        target.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        target.addEventListener("drop", function (event) {
            let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
            this.appendChild(myElement)
            this.style.border = "2px dashed #7f7fe9";
            checkPuzzles();
        }, false);
    }
}
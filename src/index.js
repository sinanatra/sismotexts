import './main.css'
import * as $ from 'jquery';
const d3 = require('d3');

d3.select("input").on("change", loadFile);

let xPrev, yPrev, mainText, fontSize;
let inputWord = 'Alice';

function loadFile() {
    const files = document.querySelector('input[type=file]').files;

    for (let num = 0; num < files.length; num++) {
        let fileReader = new FileReader();
        let file = files[num];

        fileReader.onload = function (e) {
            mainText = fileReader.result
            processFile(mainText, inputWord)
        };
        fileReader.onerror = function (e) {
            throw 'Error reading CSV file';
        };

        fileReader.readAsText(file);
    }
}

function processFile(file, inputWord) {
    let tokens = file.split(' ')
    d3.selectAll('span, circle, line').remove()

    tokens.forEach(word => {

        if (word.toLowerCase() == ' ') {
            return
        }

        if (word.toLowerCase() == inputWord.toLowerCase()) {
            d3.select('.textVis')
                .append('span')
                .attr('class', 'highlight text-' + word)
                .text(word + ' ')
        }
        else {
            d3.select('.textVis')
                .append('span')
                .attr('class', 'text-' + word)
                .text(word + ' ')
        }
    });

    let elements = document.querySelectorAll('.highlight')
    elements.forEach(element => {

        if (xPrev) {
            d3.select('.visualisation')
                .append('line')
                .attr('class', 'line')
                .attr('x1', xPrev)
                .attr('y1', yPrev)
                .attr('x2', window.scrollY + element.getBoundingClientRect().left + 'px')
                .attr('y2', window.scrollY + element.getBoundingClientRect().top + 'px')
        }

        d3.select('.visualisation')
            .append('circle')
            .attr('class', 'circle')
            .attr('cx', window.scrollY + element.getBoundingClientRect().left + 'px')
            .attr('cy', window.scrollY + element.getBoundingClientRect().top + 'px')

        xPrev = window.scrollY + element.getBoundingClientRect().left + 'px'
        yPrev = window.scrollY + element.getBoundingClientRect().top + 'px'

        d3.select('.textVis').style('font-size', fontSize + 'px')
        d3.selectAll('.line').style('stroke-width', fontSize + 'px')
        d3.selectAll('.circle').style('r', fontSize / 2 + 'px')
    });
}

$('.chooseFontSize').change(async function () {
    fontSize = this.value
    processFile(mainText, inputWord)
});

$('.chooseWord').change(async function () {
    xPrev = 0;
    yPrev = 0;
    inputWord = this.value
    processFile(mainText, inputWord)
});
const defaultText = d3.text("./src/assets/alice_in_wonderland.txt");

(async () => {
    await loadFile();
    mainText = await defaultText;
    processFile(mainText, inputWord)

})();

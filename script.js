
class CharacterWrapper {

    constructor (char) {
        this.char = char;
    }

    get wrapper () {
        const span = document.createElement('span');
        span.textContent = this.char;
        span.classList.add("character")

        return span;
    }

}

class SmoothCounter {

    constructor (element) {
        this.element = element;
        this.value = 0;
        this.updateInterval = 20;
        this.changeInterval = 400;
        this.play();
    }

    get value () {
        return this._value;
    }

    set value (value) {
        this._value = Math.max(value, 0);
    }

    play () {
        this.tickInterval = setInterval(() => this.update(), this.updateInterval);
    }

    pause () {
        clearInterval(this.tickInterval);
    }

    update () {
        const numberString = $(this.element)
            .find("> span")
            .toArray()
            .filter((span) => !span.classList.contains("absolute"))
            .map((span) => span.textContent)
            .join("")
            .replace(/,/g, '');

        const currentValue = Number.parseInt(numberString, 10) || 0;

        if (currentValue === this.value) {
            return;
        }

        let change;

        if (this.value > currentValue) {
            change = Math.min(1, this.value - currentValue);
        } else {
            change = Math.min(1, currentValue - this.value) * -1;
        }

        const resultElements = (currentValue + change)
            .toLocaleString()
            .split("")
            .map((char) => new CharacterWrapper(char).wrapper)
            .reverse();

        const currentElements = $(this.element)
            .find("> span")
            .toArray()
            .reverse();

        const elementLeft = this.element.getBoundingClientRect().x;

        currentElements.forEach((span, index) => {
            if (!resultElements[index]) {
                return;
            }

            if (span.textContent !== resultElements[index].textContent) {
                const left = span.getBoundingClientRect().x - elementLeft;
                $(span)
                    .addClass("absolute changing")
                    .css({ left });
            } else {
                $(span).addClass("absolute hidden");
            }
        });

        setTimeout(() => currentElements.forEach((span) => $(span).remove()), this.changeInterval);

        resultElements
            .reverse()
            .forEach((span) => $(span).appendTo($(this.element)));

        // this.element.textContent = (currentValue + change).toLocaleString();

    }

}

const element = document.querySelector(".value");
const counter = new SmoothCounter(element);

document.querySelector(".add").addEventListener("click", () => (counter.value += 100));
document.querySelector(".subtract").addEventListener("click", () => (counter.value -= 100));

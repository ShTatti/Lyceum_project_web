(() => { //задаёт функцию без аргумента(самая кроткая запись)
    const canvas = document.querySelector('canvas');//это
    const ctx = canvas.getContext('2d'); // и это (обычные) обращения к канве для рисования
    const label = document.querySelector('.label');
    const inputs = document.querySelectorAll('input');
    const config = {
        DotMinRad: inputs[0].value,
        DotMaxRad: inputs[1].value,
        massFactor: 0.002,
        deafColor: inputs[2].value,
        pi: 2 * Math.PI,
        maxSize: inputs[3].value,
        smooth: inputs[4].value,
        sphereRad: 300,
        cursorDotRad: 25,
        mouseSize: 100,
        time: inputs[5].value,
    }
    let w, h, mouse;
    let dots;

    class Dot {
        constructor(arr) {
            this.pos = { x: mouse.x, y: mouse.y }
            this.vel = { x: 0, y: 0 };
            this.rad = arr || random(config.DotMinRad, config.DotMaxRad);
            this.mass = this.rad * config.massFactor;
            this.color = config.deafColor;
            this.tim = config.time;
        }
        draw(bigX, bigY) {
            this.pos.x = bigX || this.pos.x + this.vel.x;
        /* почему || */    this.pos.y = bigY || this.pos.y + this.vel.y;
            createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
        /* почему 2 строки разные */    createCircle(this.pos.x, this.pos.y, this.rad, false, config.deafColor);
        }
    }
    function updateDots() {
        for (let i = 1; i < dots.length; i++) {
            let acc = { x: 0, y: 0 }
            for (let j = 0; j < dots.length; j++) {
                if (i == j) continue;
                let [a, b] = [dots[i], dots[j]];

                let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y }

                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force = (dist - config.sphereRad) / dist * b.mass;

                if (j == 0) {
                    let alpha = config.mouseSize / dist;
                    a.color = config.deafColor + `, ${alpha})`;
                    if (dist < config.mouseSize) { force = (dist - config.mouseSize) * b.mass } else {
                    }
                }
                acc.x += delta.x * force;
                acc.y += delta.y * force;
            }
            dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
            dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
            dots[i].tim -= 1;

            if (dots[i].tim < 0) {
                if (dots.length > 60)
                    dots.splice(i, 1) // возвращает новый массив, содержащий копию части исходного массива.
            }
        }
       dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
    }

    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color; //задаёт цвет или стиль, используемый при выполнении обводки фигур
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.stroke();//обводит текущий или данный контур цветом strokeStyle
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        mouse = { x: w / 2, y: h / 2, down: false }
        dots = [];
        dots.push(new Dot(config.cursorDotRad))
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);

        if (mouse.down) {
            if (dots.length < config.maxSize) {
                dots.push(new Dot());
            }
        }
        updateDots();
        updateLabel();
        window.requestAnimationFrame(loop)
    }

    init();
    loop();
    function clear() {
        init();
    }

    function isDown() {
        mouse.down = !mouse.down;
    }

    function updateLabel() {
    }

    function setPos({ layerX, layerY }) {
        [mouse.x, mouse.y] = [layerX, layerY];
    }

    canvas.addEventListener('mousemove', setPos);
    canvas.addEventListener('mousedown', isDown);
    canvas.addEventListener('mouseup', isDown);

    function getColor() {
        var str = document.querySelector('#color').style.backgroundColor; 
        str = str.substring(3, str.length - 1);
        var res = 'rgba(' + str;
        config.deafColor = res;
    }

    let updateConfig = () => {
        $(document).ready(function () {
            $('.val').farbtastic('#color');
            document.querySelector('.farbtastic').addEventListener('mouseup', function () {
                var str = document.querySelector('#color').style.backgroundColor; 
                str = str.substring(4, str.length - 1);
                var res = 'rgba(' + str;
                config.deafColor = res;
                document.querySelector('#color').value = res;
                dots[0].color = config.deafColor
            })
        });
        inputs.forEach(element => {
            element.addEventListener('change', function () {
                let type = this.getAttribute('data-type');
                if (type == 'data-min_rad') {
                    config.DotMinRad = element.value;
                }
                if (type == 'data-max_rad') {
                    config.DotMaxRad = element.value;
                }
                if (type == 'data-color') {

                }
                if (type == 'data-smooth') {
                    config.smooth = element.value;
                }
                if (type == 'data-living_time') {
                    config.time = element.value;
                }
                if (type == 'data-size') {
                    config.maxSize = element.value
                }
                clear();
            })
        });
    }
    updateConfig();
})();
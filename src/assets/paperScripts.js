import { on } from '@svgdotjs/svg.js';
import { paper } from 'paper';
const paperCanvas = document.getElementById('paper');
paper.setup(paperCanvas);

export const paperScript = () => {
	// const path = new paper.Path();
	// path.strokeColor = 'red';
	// var start = new paper.Point(100, 100);
	// path.moveTo(start);
	// path.lineTo(start.add([200, 200]));
	// paper.view.draw();

	let path;

	const bg = new paper.Path.Rectangle({
		point: [0, 0],
		size: paper.view.size,
	});
	bg.fillColor = '#F34E54';

	const tool = new paper.Tool();
	tool.minDistance = 10;
	tool.maxDistance = 200;

	const onMouseDown = (event) => {
		path = new paper.Path();
		path.fillColor = {
			hue: Math.random() * 360,
			saturation: 1,
			brightness: 1,
		};

		path.add(event.point);
	};

	tool.onMouseDown = onMouseDown;

	const onMouseDrag = (event) => {
		var step = event.delta.divide(2);
		step.angle += 90;
		console.log(step.angle);

		var top = event.middlePoint.add(step);
		var bottom = event.middlePoint.subtract(step);

		path.add(top);
		path.insert(0, bottom);
		path.smooth();
	};

	tool.onMouseDrag = onMouseDrag;

	tool.onMouseUp = (event) => {
		path.add(event.point);
		path.closed = true;
		path.smooth();
	};

	tool.activate();
};

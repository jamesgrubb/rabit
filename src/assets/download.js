export const download = (renderer) => {
	const image = renderer.domElement.toDataURL();
	const tmpLink = document.createElement('a');
	tmpLink.download = 'rabit.png';
	tmpLink.href = image;
	document.body.appendChild(tmpLink);
	tmpLink.click();
	document.body.removeChild(tmpLink);
};

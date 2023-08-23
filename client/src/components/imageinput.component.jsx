const ImageInput = ({ value, onChange }) => {
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		onChange(file);
	};

	return (
		<input
			type="file"
			accept="image/png, image/jpeg"
			onChange={handleImageChange}
		/>
	);
};

export default ImageInput;

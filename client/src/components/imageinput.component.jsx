import { forwardRef, useState } from "react";

const ImageInput = forwardRef(({ value, onChange }, ref) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setSelectedImage(file);
		onChange(file);
	};

	return (
		<div>
			<input
				ref={ref}
				type="file"
				accept="image/png, image/jpeg"
				onChange={handleImageChange}
				className={`${
					value && !selectedImage
						? "hidden"
						: "block w-full text-sky-800 hover:file:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-800 file:cursor-pointer hover:file:bg-sky-800"
				}`}
			/>
		</div>
	);
});

export default ImageInput;

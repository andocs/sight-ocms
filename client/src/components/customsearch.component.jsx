import {
	useState,
	useImperativeHandle,
	useEffect,
	useRef,
	forwardRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInventory } from "../features/order/orderSlice";

const CustomSearchInput = forwardRef(
	(
		{
			onInputChange,
			onSelect,
			value,
			placeholder,
			onRemove,
			initialValue,
			category,
		},
		ref
	) => {
		const dispatch = useDispatch();
		const [inputValue, setInputValue] = useState(value || "");
		const [filteredSuggestions, setFilteredSuggestions] = useState([]);
		const [itemSelected, setItemSelected] = useState(false);
		const inventoryItems = useSelector((state) => state.order.item);
		const inputRef = useRef(null);

		useEffect(() => {
			if (!inventoryItems) {
				dispatch(getInventory());
			}
		}, [inventoryItems]);

		useEffect(() => {
			setItemSelected(value === initialValue);
		}, [value, initialValue]);

		const handleChange = (e) => {
			const newValue = e.target.value;
			setInputValue(newValue);
			setItemSelected(newValue === initialValue);

			if (newValue.trim() === "") {
				setFilteredSuggestions([]);
				return;
			}
			if (inventoryItems) {
				const filtered = inventoryItems.filter(
					(item) =>
						item.itemName.toLowerCase().includes(newValue.toLowerCase()) &&
						(!category || item.category === category)
				);
				setFilteredSuggestions(filtered);
			}
			onInputChange(newValue, itemSelected);
		};

		useEffect(() => {
			const handleClickOutside = (event) => {
				if (inputRef.current && !inputRef.current.contains(event.target)) {
					setFilteredSuggestions([]);
				}
			};
			document.addEventListener("click", handleClickOutside);

			return () => {
				document.removeEventListener("click", handleClickOutside);
			};
		}, []);

		const clearInputValue = () => {
			setInputValue("");
			setFilteredSuggestions([]);
		};
		useImperativeHandle(ref, () => ({
			clearInputValue,
		}));

		const handleRemoveQuery = () => {
			setInputValue("");
			onRemove();
			setFilteredSuggestions([]);
			setItemSelected(false);
		};

		const handleSelect = (selectedItem) => {
			setInputValue(selectedItem.itemName);
			setItemSelected(true);
			setFilteredSuggestions([]);
			onSelect(selectedItem);
		};

		return (
			<div>
				<div className="relative mt-4" ref={inputRef}>
					<input
						type="text"
						placeholder={placeholder}
						value={inputValue}
						onChange={handleChange}
						className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
					/>
					{inputValue && (
						<button
							type="button"
							onClick={handleRemoveQuery}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-800 focus:outline-none"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
					{inputValue &&
						filteredSuggestions &&
						filteredSuggestions.length > 0 && (
							<div className="bg-white border border-gray-200 rounded-lg shadow-lg absolute w-full max-h-40 overflow-y-auto z-10">
								<ul className="divide-y divide-gray-200">
									{filteredSuggestions.map((result, index) => (
										<li
											key={index}
											className="hover:bg-gray-100 cursor-pointer px-4 py-2"
											onClick={() => handleSelect(result)}
										>
											{result.itemName}
										</li>
									))}
								</ul>
							</div>
						)}
				</div>
			</div>
		);
	}
);
export default CustomSearchInput;

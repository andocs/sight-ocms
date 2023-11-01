import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import DoctorCards from "./doctorcards.component";

const CardCarousel = ({ cards }) => {
	return (
		<>
			<Swiper
				slidesPerView={1}
				spaceBetween={30}
				loop={true}
				pagination={{
					clickable: true,
				}}
				navigation={true}
				modules={[Pagination, Navigation]}
				className="mySwiper"
			>
				{cards.map((card, cardIndex) => (
					<SwiperSlide key={cardIndex}>
						<DoctorCards props={card} />
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};

export default CardCarousel;

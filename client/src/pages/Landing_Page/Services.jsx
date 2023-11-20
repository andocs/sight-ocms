import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { EffectFade, Navigation, Pagination } from "swiper/modules";

function Services() {
	return (
		<>
			<Swiper
				loop={true}
				pagination={{
					dynamicBullets: true,
				}}
				modules={[EffectFade, Navigation, Pagination]}
			>
				<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-1.jpg" />
				</SwiperSlide>
				<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-2.jpg" />
				</SwiperSlide>
				<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-3.jpg" />
				</SwiperSlide>
				<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-4.jpg" />
				</SwiperSlide>
			</Swiper>
		</>
	);
}

export default Services;

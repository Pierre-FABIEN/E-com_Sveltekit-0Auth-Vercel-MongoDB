<script lang="ts">
	import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';

	import '@splidejs/splide/dist/css/themes/splide-default.min.css';

	import '@splidejs/svelte-splide/css/core';

	const splideOptions: {
		type: 'loop';
		gap: string;
		drag: 'free';
		arrows: boolean;
		pagination: boolean;
		perPage: number;
		autoScroll: {
			pauseOnHover: boolean;
			pauseOnFocus: boolean;
			rewind: boolean;
			speed: number;
		};
	} = {
		type: 'loop',
		gap: '10px',
		drag: 'free',
		arrows: false,
		pagination: false,
		perPage: 3,
		autoScroll: {
			pauseOnHover: true,
			pauseOnFocus: true,
			rewind: false,
			speed: 1
		}
	};
</script>

<Splide options={splideOptions} extensions={{ AutoScroll }} aria-label="My Favorite Images">
	<SplideSlide role="tabpanel" aria-label="GitHub Logo 1" id="splide01">
		<img src="/logo.svg" alt="Logo GitHub" class="imgcarousel" width="50" height="50" />
	</SplideSlide>
	<SplideSlide role="tabpanel" aria-label="GitHub Logo 2" id="splide02">
		<img src="/logo.svg" alt="Logo GitHub" class="imgcarousel" width="50" height="50" />
	</SplideSlide>
	<SplideSlide role="tabpanel" aria-label="GitHub Logo 3" id="splide03">
		<img src="/logo.svg" alt="Logo GitHub" class="imgcarousel" width="50" height="50" />
	</SplideSlide>
	<SplideSlide role="tabpanel" aria-label="GitHub Logo 4" id="splide04">
		<img src="/logo.svg" alt="Logo GitHub" class="imgcarousel" width="50" height="50" />
	</SplideSlide>
	<SplideSlide role="tabpanel" aria-label="GitHub Logo 5" id="splide05">
		<img src="/logo.svg" alt="Logo GitHub" class="imgcarousel" width="50" height="50" />
	</SplideSlide>
	<SplideSlide role="tabpanel" aria-label="GitHub Logo 6" id="splide06">
		<img src="/logo.svg" alt="Logo GitHub" class="imgcarousel" width="50" height="50" />
	</SplideSlide>
	<SplideSlide role="tabpanel" aria-label="GitHub Logo 7" id="splide07">
		<img src="/logo.svg" alt="Logo GitHub" class="imgcarousel" width="50" height="50" />
	</SplideSlide>
</Splide>

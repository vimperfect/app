import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function slideHorizontal(
	node: Element,
	{ direction = 'left', duration = 300, easing = cubicOut }
): TransitionConfig {
	const style = getComputedStyle(node);
	const opacity = +style.opacity;

	// Determine direction multiplier
	const sign = direction === 'left' ? 1 : -1;

	return {
		duration,
		easing,
		css: (t, u) => `
      transform: translateX(${sign * u * 100}%);
      opacity: ${t * opacity};
    `
	};
}

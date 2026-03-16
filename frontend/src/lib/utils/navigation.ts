import { SearchIcon, LayersIcon, StarIcon } from 'svelte-feather-icons';
import type { ComponentType } from 'svelte';

export const navigation: { name: string; href: string; icon: ComponentType }[] = [
    { name: 'Search',           href: '/search',           icon: SearchIcon },
    { name: 'Similarity Check', href: '/similarity-check', icon: LayersIcon },
    { name: 'Novelty Checker',  href: '/novelty-checker',  icon: StarIcon   },
];

export let userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Settings',     href: '/settings' },
];
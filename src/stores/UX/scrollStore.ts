import { writable, type Writable } from 'svelte/store';
import type Scrollbar from 'smooth-scrollbar';

// Initialisation du store avec une valeur par défaut null, mais typé comme Scrollbar ou null
const smoothScrollStore: Writable<Scrollbar | null> = writable(null);

export default smoothScrollStore;

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'forged-wheel', name: 'Forged Wheels' },
  { id: 'cast-wheel', name: 'Alloy Wheels' },
  { id: 'tire', name: 'Tires' },
  { id: 'wheel-set', name: 'Wheel Sets' },
  { id: 'accessory', name: 'Accessories' },
];

export const categoryNames = Object.fromEntries(
  categories.filter(({ id }) => id !== 'all').map(({ id, name }) => [id, name])
);

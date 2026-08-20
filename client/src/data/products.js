export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'forged-wheel', name: 'Forged Wheels' },
  { id: 'cast-wheel', name: 'Alloy Wheels' },
  { id: 'tire', name: 'Tires' },
  { id: 'wheel-set', name: 'Wheel Sets' },
  { id: 'accessory', name: 'Accessories' },
];

export const categoryNames = Object.fromEntries(
  categories.filter(({ id }) => {
                      //筛选符合条件的数据
                      return id !== 'all';
                    }).map(({ id, name }) => {
                                                    //渲染:渲染列表内容
                                                    return [id, name];
                                                  })
);

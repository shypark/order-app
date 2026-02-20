// 커피 메뉴 데이터 (PRD/와이어프레임 기준)
export const MENU_OPTIONS = [
  { id: 'shot', label: '샷 추가', price: 500 },
  { id: 'syrup', label: '시럽 추가', price: 0 },
]

export const COFFEE_MENU = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    price: 4500,
    description: '에스프레소에 찬물과 얼음을 더한 시원한 아메리카노입니다.',
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    price: 4000,
    description: '에스프레소에 뜨거운 물을 더한 클래식 아메리카노입니다.',
  },
  {
    id: 'cafe-latte-hot',
    name: '카페라떼(HOT)',
    price: 4500,
    description: '풍부한 에스프레소와 스팀 밀크의 조화입니다.',
  },
  {
    id: 'cafe-latte-ice',
    name: '카페라떼(ICE)',
    price: 5000,
    description: '에스프레소와 차가운 우유, 얼음으로 완성한 라떼입니다.',
  },
  {
    id: 'vanilla-latte',
    name: '바닐라 라떼(HOT)',
    price: 5500,
    description: '바닐라 시럽이 더해진 달콤한 라떼입니다.',
  },
  {
    id: 'cold-brew',
    name: '콜드브루',
    price: 5000,
    description: '차가운 물로 긴 시간 추출한 깔끔한 커피입니다.',
  },
]

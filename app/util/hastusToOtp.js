
const routeMap = {
  '16DU':'16CDU',
  '16U':'16CSU',
  'N04':'N4',
  'S04':'S4',
  'S05':'S5',
  'W01':'W1',
}

const re = new RegExp(Object.keys(routeMap).join("|"))

export default function hastusToOtp(route) {
  return route.replace(re, (matched) => routeMap[matched])
}

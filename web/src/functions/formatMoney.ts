export function formatMoney(money: number) {
  const formatMoney = Intl.NumberFormat("en-US");
  return formatMoney.format(money);
}

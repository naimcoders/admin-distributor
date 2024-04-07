export function formatRupiah(number: number): string {
  const cleanNumber = number.toString().replace(/\D/g, "");

  let formatted = "";
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    formatted = cleanNumber[i] + formatted;
    if ((cleanNumber.length - i) % 3 === 0 && i !== 0) {
      formatted = "." + formatted;
    }
  }

  formatted = "Rp " + formatted;
  return formatted;
}

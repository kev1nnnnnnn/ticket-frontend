/**
 * Formata um valor como moeda brasileira (R$ 0,00)
 * Aceita string ou number e retorna string formatada
 */
export function maskCurrency(value: string | number): string {
  const amount = Number(value); // valor já em reais
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}


/**
 * Event handler para input que formata enquanto digita
 */
// src/utils/mask.ts
export function handleCurrencyInput(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) {
  const el = e.target as HTMLInputElement;

  // Remove tudo que não é número
  let numericValue = el.value.replace(/\D/g, '');

  // Divide por 100 para ter centavos
  let amount = Number(numericValue) / 100;

  // Formata para BRL
  el.value = amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

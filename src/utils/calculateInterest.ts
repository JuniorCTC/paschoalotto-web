export interface DebtToCalculate {
  id: number;
  dueDate: string;
  originalValue: number;
  commissionPercentage: number;
  maxPortions: number;
  interestType: number;
  interestRate: number;
  calculatedDate: string;
}

export interface DebtCalculated {
  dueDate: string;
  originalValue: number;
  commissionPercentage: number;
  maxPortions: number;
  interestType: number;
  calculatedDate: string;

  interestValue: number;
  commisionValue: number;
  delayDays: number;
  calculatedValue: number;
  portions: Array<{
    id: number;
    value: number;
    dueDate: string;
    debtId: number;
  }>;
}

export interface Portions {
  id: number;
  value: number;
  dueDate: string;
  debtId: number;
}

export function calculate(debt: DebtToCalculate) {
  const days = DateDiffInDays(debt.dueDate, debt.calculatedDate);
  let totalValuePlusInterest = 0;

  if (debt.interestType === 1) {
    totalValuePlusInterest = calculateSimpleInterest(debt, days);
  } else if (debt.interestType === 2) {
    totalValuePlusInterest = calculateCompoundInterest(debt, days);
  } 

  const debtCalculated = calculatePortions(debt, totalValuePlusInterest, days);

  return debtCalculated;  
}

export function calculateSimpleInterest(debt: DebtToCalculate, days: number) {
  //valor total com juros, dias atraso, valor original, valorJuros, calcular parcelas
  //A = P * (1 + r * T);
  const P = debt.originalValue; //3000
  const r = debt.interestRate; // 0.002
  const T = days; // Days

  const A = P * (1 + r * T);

  return A;
}

export function calculateCompoundInterest(debt: DebtToCalculate, days: number) {
  //A = P + Math.pow((1 + r), T); //elevado ao t;
  const P = debt.originalValue; //3000
  const r = debt.interestRate; // 0.002
  const T = days; // Days

  const A = P * Math.pow((1 + r), T); //elevado ao t;

  return A;
}

export function calculatePortions(
  debt: DebtToCalculate,
  totalValuePlusInterest: number,
  days: number
) {
  const maxPortions = debt.maxPortions;
  const interestValue = totalValuePlusInterest - debt.originalValue;
  const delayDays = days; //dias de atraso
  const commisionValue = totalValuePlusInterest * debt.commissionPercentage;

  let portionValue = totalValuePlusInterest / maxPortions;

  const portions = [];

  for (var i = 1; i <= maxPortions; i++) {
    portions.push({
      id: i,
      value: portionValue,
      dueDate: calculateFutureMonths(debt.calculatedDate, i),
      debtId: debt.id,
    });
  }

  const debtCalculated: DebtCalculated = {
    dueDate: debt.dueDate,
    originalValue: debt.originalValue,
    commissionPercentage: debt.commissionPercentage,
    maxPortions: debt.maxPortions,
    interestType: debt.interestType,
    calculatedDate: debt.calculatedDate,

    interestValue: interestValue,
    commisionValue: commisionValue,
    delayDays: delayDays,
    calculatedValue: totalValuePlusInterest,
    portions: portions,
  };

  return debtCalculated;
}


export function DateDiffInDays(dueDate: string, calculatedDate: string) {
  const dueDateConverted = convertStringToDate(dueDate);
  const calculatedDateConverted = convertStringToDate(calculatedDate);

  const diff = Math.abs(
    dueDateConverted.getTime() - calculatedDateConverted.getTime()
  );
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days;
}

export function convertStringToDate(originalDate: string) {
  /* Separa os valores */
  let dateString = originalDate.split("/");

  /* Define a data com os valores separados */
  let date = new Date(
    parseInt(dateString[2]),
    parseInt(dateString[1]),
    parseInt(dateString[0])
  );

  return date;
}

export function calculateFutureMonths(dueDate: string, monthsAhead: number) {
  let dateString = dueDate.split("/");

  let date = new Date(
    parseInt(dateString[2]),
    parseInt(dateString[1]) + (monthsAhead - 2),
    parseInt(dateString[0]) + 1
  );

  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function numberToReal(value: number){
  var real = "R$ " + value.toFixed(2).replace(".",",");
  return real;
}

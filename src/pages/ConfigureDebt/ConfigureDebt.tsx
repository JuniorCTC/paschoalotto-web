import React, { FormEvent, useState } from "react";

import TopBar from "../components/TopBar/TopBar";
import logoImg from "../../images/paschoalottoLogo.svg";

import api from "../../services/api";

import {
  calculate,
  numberToReal,
} from "../../utils/calculateInterest";

import "./ConfigureDebt.css";

interface Portions {
  id: number;
  value: number;
  dueDate: string;
  debtId: number;
}

// interface DebtToSave {
//   id: number,
//   dueDate: string,
//   originalValue: number,
//   commissionPercentage: number,
//   maxPortions: number,
//   interestType: number,
//   calculatedDate: string,

//   customerId: number,
//   customerName: string
//   coworkerPhone: string, 

//   interestValue: number,
//   commisionValue: number,
//   delayDays: number,
//   calculatedValue: number,
//   portions: Array<{
//     id: number;
//     value: number;
//     dueDate: string;
//     debtId: number;
//   }>;
// }

function getCurrentDate() {
  return new Date().toLocaleDateString();
}

export default function ConfigureDebt() {
  const [id] = useState(1); //PRIMARY KEY
  const [dueDate, setDueDate] = useState("21/10/2020");
  const [customerId, setCustomerId] = useState(1);
  const [originalValue, setOriginalValue] = useState(3000);
  const [commissionPercentage, setCommissionPercentage] = useState(0.3);
  const [interestRate, setInterestRate] = useState(0.002);
  const [customerName, setCustomerName] = useState("Naoshi Arimori");
  const [maxPortions, setMaxPortions] = useState(1);
  const [interestType, setInterestType] = useState(1);
  const [coworkerPhone, setCoworkerPhone] = useState("14 98195-9035");
  const [calculatedDate, setCalculatedDate] = useState(getCurrentDate());

  const [interestValue, setInterestValue] = useState(0);
  const [commisionValue, setCommisionValue] = useState(0);
  const [delayDays, setDelayDays] = useState(0);
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [portions, setPortions] = useState<Portions[]>([]);

  function formatDateStringToDate(dateString: string) {
    let date = dateString.split("/");

    let dateFormatted = `${date[2]}-${date[1]}-${date[0]}`;
    
    return dateFormatted;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const debt = {
      id,
      dueDate,
      originalValue,
      commissionPercentage,
      maxPortions,
      interestType,
      interestRate,
      calculatedDate,
    };
    const response = calculate(debt);

    setCalculatedValue(response.calculatedValue);
    setDelayDays(response.delayDays);
    setInterestValue(response.interestValue);
    setPortions(response.portions);
    setCommisionValue(response.commisionValue);
  }

  async function handleSaveDebt(){
    const debtToSave = {
      id: id,
      dueDate: formatDateStringToDate(dueDate),
      originalValue: originalValue,
      commissionPercentage: commissionPercentage,
      maxPortions: maxPortions,
      interestType: interestType,
      calculatedDate: formatDateStringToDate(calculatedDate),

      customerId: customerId,
      customerName: customerName,
      coworkerPhone: coworkerPhone,     

      interestValue: interestValue,
      commisionValue: commisionValue,
      delayDays: delayDays,
      calculatedValue: calculatedValue,
      portions: portions,
    };

    await api.post("debt", debtToSave);

    alert("Dados salvos com sucesso!");    
  }

  return (
    <div id="page-configure-debt">
      <TopBar />

      <main>
        <img src={logoImg} alt="Paschoalotto" />

        <form onSubmit={handleSubmit} className="configure-debt-form">
          <fieldset>
            <legend>Configure suas parcelas</legend>

            <div className="input-block">
              <label htmlFor="customerId">Código do cliente</label>
              <input
                id="customerId"
                value={customerId}
                onChange={(event) =>
                  setCustomerId(parseInt(event.target.value))
                }
              />
            </div>

            <div className="input-block">
              <label htmlFor="customerName">Nome do cliente</label>
              <input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="originalValue">Valor da Dívida</label>
              <input
                id="originalValue"
                value={originalValue}
                onChange={(event) => {
                  let value = parseFloat(event.target.value);
                  setOriginalValue(value > 0 ? value : 0);
                }}
              />
            </div>

            <div className="input-block">
              <label htmlFor="calculatedDate">Data de cálculo</label>
              <input
                id="calculatedDate"
                value={calculatedDate}
                onChange={(event) => setCalculatedDate(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="commissionPercentage">
                Porcentagem de comissão
              </label>
              <input
                id="commissionPercentage"
                value={commissionPercentage}
                step="0,010"
                type="number"
                onChange={(event) => {
                  let value = parseFloat(event.target.value.replace(",", "."));
                  setCommissionPercentage(value);
                }}
              />
            </div>

            <div className="input-block">
              <label htmlFor="interestRate">Taxa de juros</label>
              <input
                id="interestRate"
                value={interestRate}
                step="0,010"
                type="number"
                onChange={(event) => {
                  let value = parseFloat(event.target.value.replace(",", "."));
                  setInterestRate(value);
                }}
              />
            </div>

            <div className="input-block">
              <label htmlFor="dueDate">Data de vencimento</label>
              <input
                id="dueDate"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="maxPortions">Quantidade de parcelas</label>
              <input
                id="maxPortions"
                value={maxPortions}
                type="number"
                onChange={(event) =>
                  setMaxPortions(parseInt(event.target.value))
                }
              />
            </div>

            <div className="input-block">
              <label htmlFor="coworkerPhone">Telefone para contato</label>
              <input
                id="coworkerPhone"
                value={coworkerPhone}
                onChange={(event) => setCoworkerPhone(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="interestType">Tipo de Juros</label>

              <div className="button-select">
                <button
                  type="button"
                  className={interestType === 1 ? "active" : ""}
                  onClick={() => setInterestType(1)}
                >
                  Simples
                </button>
                <button
                  type="button"
                  className={interestType === 2 ? "active" : ""}
                  onClick={() => setInterestType(2)}
                >
                  Composto
                </button>
              </div>
            </div>

            <button className="confirm-button" type="submit">
              Gerar parcelas
            </button>
          </fieldset>

          <fieldset>
            <legend>Resultado</legend>
            <div className="input-block">
              <label htmlFor="originalValue">Valor Original</label>
              <input
                id="originalValue"
                value={numberToReal(originalValue)}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="input-block">
              <label htmlFor="calculatedValue">Valor Final</label>
              <input
                id="calculatedValue"
                value={numberToReal(calculatedValue)}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="input-block">
              <label htmlFor="delayDays">Dias de atraso</label>
              <input
                id="delayDays"
                value={delayDays}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="input-block">
              <label htmlFor="interestValue">Valor juros</label>
              <input
                id="interestValue"
                value={numberToReal(interestValue)}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="input-block">
              <label htmlFor="commisionValue">Valor de comissão</label>
              <input
                id="commisionValue"
                value={numberToReal(commisionValue)}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="portion-block">
              {portions.length > 0 &&
                portions.map((portion, index) => {
                  return (
                  <div key={index} className="portion-content">
                      <p className="portion">Parcela {index + 1}</p>
                      <p className="portionValue">
                        <strong>{numberToReal(portion.value)}</strong>
                      </p>
                      <p className="portion">Vencimento: {portion.dueDate}</p>
                    </div>
                  );
                })}
            </div>

            <button 
              className="confirm-button" 
              type="button"
              onClick={() => handleSaveDebt()}
            >
              Salvar
            </button>
          </fieldset>
        </form>
      </main>
    </div>
  );
}

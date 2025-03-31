export const creditSim_repaymentMethods = [
  { value: '1', viewValue: 'Anuități constante' },
  { value: '2', viewValue: 'Rate lunare constante' },
  { value: '3', viewValue: 'Rambursare totală la scadență' }
];
export const investmentSim_savingFrequency = [
  { value: '1', viewValue: 'Anual' },
  { value: '2', viewValue: 'Semestrial' },
  { value: '3', viewValue: 'Trimestrial' }, 
  { value: '4', viewValue: 'Lunar' }
];

export const creditSim_displayedColumns = [
  'creditSim_luna',
  'creditSim_soldInitial',
  'creditSim_anuitate',
  'creditSim_principal',
  'creditSim_dobanda',
  'creditSim_comisionLunar',
  'creditSim_totalPlata',
  'creditSim_rambursareAnticipata'
];

export const depositSim_displayedColumns = [
  'depositSim_luna',
  'depositSim_soldInitial',
  'depositSim_sumaDepusa',
  'depositSim_dobanda',
  'depositSim_impozit',
  'depositSim_comision',
  'depositSim_soldFinal'
];

export const investmentSim_displayedColumns = [
  'investmentSim_luna',
  'investmentSim_soldInitial',
  'investmentSim_sumaDepusa',
  'investmentSim_profit',
  'investmentSim_impozit',
  'investmentSim_soldFinal',
  'investmentSim_topUps',
  'investmentSim_withdrawls',
];


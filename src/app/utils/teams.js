const LOGO_COLORS = {
  ATL: '#E03A3E',
  BKN: '#000000',
  BOS: '#008348',
  CHA: '#1D1160',
  CHI: '#CE1141',
  CLE: '#860038',
  DAL: '#007DC5',
  DEN: '#4FA8FF',
  DET: '#001F70',
  GSW: '#006BB6',
  HOU: '#CE1141',
  IND: '#00275D',
  LAC: '#ED174C',
  LAL: '#552582',
  MEM: '#23375B',
  MIA: '#98002E',
  MIL: '#00471B',
  MIN: '#005083',
  NOP: '#002B5C',
  NYK: '#006BB6',
  OKC: '#007DC3',
  ORL: '#007DC5',
  PHI: '#006BB6',
  PHX: '#1D1160',
  POR: '#000000',
  SAC: '#724C9F',
  SAS: '#000000',
  TOR: '#CE1141',
  UTA: '#002B5C',
  WAS: '#002566',

  EST: '#0067AC',
  WST: '#ED174C',
}

const TEAM_ID = {
  ATL: '1610612737',
  BKN: '1610612751',
  BOS: '1610612738',
  CHA: '1610612766',
  CHI: '1610612741',
  CLE: '1610612739',
  DAL: '1610612742',
  DEN: '1610612743',
  DET: '1610612765',
  GSW: '1610612744',
  HOU: '1610612745',
  IND: '1610612754',
  LAC: '1610612746',
  LAL: '1610612747',
  MEM: '1610612763',
  MIA: '1610612748',
  MIL: '1610612749',
  MIN: '1610612750',
  NOP: '1610612740',
  NYK: '1610612752',
  OKC: '1610612760',
  ORL: '1610612753',
  PHI: '1610612755',
  PHX: '1610612756',
  POR: '1610612757',
  SAC: '1610612758',
  SAS: '1610612759',
  TOR: '1610612761',
  UTA: '1610612762',
  WAS: '1610612764',
}

export const eastTeams = [
  TEAM_ID.ATL,
  TEAM_ID.BKN,
  TEAM_ID.BOS,
  TEAM_ID.CHA,
  TEAM_ID.CHI,
  TEAM_ID.CLE,
  TEAM_ID.DET,
  TEAM_ID.IND,
  TEAM_ID.MIA,
  TEAM_ID.MIL,
  TEAM_ID.NYK,
  TEAM_ID.ORL,
  TEAM_ID.PHI,
  TEAM_ID.TOR,
  TEAM_ID.WAS,
]

export const westTeams = [
  TEAM_ID.DAL,
  TEAM_ID.DEN,
  TEAM_ID.GSW,
  TEAM_ID.HOU,
  TEAM_ID.LAC,
  TEAM_ID.LAL,
  TEAM_ID.MEM,
  TEAM_ID.MIN,
  TEAM_ID.NOP,
  TEAM_ID.OKC,
  TEAM_ID.PHX,
  TEAM_ID.POR,
  TEAM_ID.SAC,
  TEAM_ID.SAS,
  TEAM_ID.UTA,
]

const shortNames = {
  ATL: 'Hawks',
  BOS: 'Celtics',
  BKN: 'Nets',
  CHA: 'Hornets',
  CHI: 'Bulls',
  CLE: 'Cavaliers',
  DAL: 'Mavericks',
  DEN: 'Nuggets',
  DET: 'Pistons',
  GSW: 'Warriors',
  HOU: 'Rockets',
  IND: 'Pacers',
  LAC: 'Clippers',
  LAL: 'Lakers',
  MEM: 'Grizzlies',
  MIA: 'Heat',
  MIL: 'Bucks',
  MIN: 'Timberwolves',
  NOP: 'Pelicans',
  NYK: 'Knicks',
  OKC: 'Thunder',
  ORL: 'Magic',
  PHI: '76ers',
  PHX: 'Suns',
  POR: 'Trail Blazers',
  SAC: 'Kings',
  SAS: 'Spurs',
  TOR: 'Raptors',
  UTA: 'Jazz',
  WAS: 'Wizards',
}

export const teams = {
  ATL: 'Atlanta Hawks',
  BOS: 'Boston Celtics',
  BKN: 'Brooklyn Nets',
  CHA: 'Charlotte Hornets',
  CHI: 'Chicago Bulls',
  CLE: 'Cleveland Cavaliers',
  DAL: 'Dallas Mavericks',
  DEN: 'Denver Nuggets',
  DET: 'Detroit Pistons',
  GSW: 'Golden State Warriors',
  HOU: 'Houston Rockets',
  IND: 'Indiana Pacers',
  LAC: 'LA Clippers',
  LAL: 'Los Angeles Lakers',
  MEM: 'Memphis Grizzlies',
  MIA: 'Miami Heat',
  MIL: 'Milwaukee Bucks',
  MIN: 'Minnesota Timberwolves',
  NOP: 'New Orleans Pelicans',
  NYK: 'New York Knicks',
  OKC: 'Oklahoma City Thunder',
  ORL: 'Orlando Magic',
  PHI: 'Philadelphia 76ers',
  PHX: 'Phoenix Suns',
  POR: 'Portland Trail Blazers',
  SAC: 'Sacramento Kings',
  SAS: 'San Antonio Spurs',
  TOR: 'Toronto Raptors',
  UTA: 'Utah Jazz',
  WAS: 'Washington Wizards',
}

export const getTeamNameById = (id) => {
  let name = ''
  id = typeof id === 'number' ? id.toString() : id
  Object.keys(TEAM_ID).forEach((key) => {
    if (TEAM_ID[key] === id) {
      name = key
    }
  })
  return name
}

export const getLogoColorByName = (name, defaultColor = '#000000') => {
  return LOGO_COLORS[name] || defaultColor
}

export const getNickNamesByTriCode = (triCode) => {
  return shortNames[triCode] || triCode
}

export const getLogoColorById = (id) => {
  let name = ''
  id = typeof id === 'number' ? id.toString() : id
  Object.keys(TEAM_ID).forEach((key) => {
    if (TEAM_ID[key] === id) {
      name = key
    }
  })
  return getLogoColorByName(name)
}

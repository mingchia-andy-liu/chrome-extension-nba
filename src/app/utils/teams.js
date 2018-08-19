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
    BOS: '1610612738',
    BKN: '1610612751',
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
    Object.keys(TEAM_ID).forEach(key => {
        if (TEAM_ID[key] === id) {
            name = key
        }
    })
    return name
}

export const getLogoColorByName = (name) => {
    return LOGO_COLORS[name] || '#000000'
}

export const getLogoColorById = (id) => {
    let name = ''
    Object.keys(TEAM_ID).forEach(key => {
        if (TEAM_ID[key] === id) {
            name = key
        }
    })
    return getLogoColorByName(name)
}

 

export const theme = (isDarkTheme) => {
    return {
        // Background 
        BodyBack:  isDarkTheme ? '#0a0c12' : '#000',
        Leftbarbg: isDarkTheme ? '#0a0c12' : '#0a0c12', 
        BTNback01: isDarkTheme ? '#3e334b' : '#3e334b',
        BTNback01Hover: isDarkTheme ? '#4f445d' : '#4f445d',
        BG1Shadow:  isDarkTheme ? 'rgb(0 0 0 / 40%)' : 'rgb(0 0 0 / 40%)',
        


        // Color 
        GColor1: isDarkTheme ? '#e26304' : '#e26304',
        GColor2: isDarkTheme ? '#ffb22b' : '#ffb22b', 
        GColor1Light: isDarkTheme ? 'rgb(226 99 4 / 40%)' : 'rgb(226 99 4 / 40%)',
        GColor2Light: isDarkTheme ? 'rgb(255 178 43 / 40%)' : 'rgb(255 178 43 / 40%)',
        GColor1Medium: isDarkTheme ? 'rgb(115 59 173 / 80%)' : 'rgb(115 59 173 / 80%)',
        GColor2Medium: isDarkTheme ? 'rgb(79 0 207 / 80%)' : 'rgb(79 0 207 / 80%)',
        GColor1LightW: isDarkTheme ? 'rgb(115 59 173 / 40%)' : 'rgb(214 184 174 / 40%)',
        GColor2LightW: isDarkTheme ? 'rgb(79 0 207 / 40%)' : 'rgb(187 131 112 / 40%)',
    }
}
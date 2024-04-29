import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import Media from './../theme/media-breackpoint';
import MainBG from './../assets/images/bg.jpg'

var Gs = {};

Gs.GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0; 
    font-family: 'Urbanist', sans-serif;
    font-weight:400 ;
    /* background: url(${MainBG}); 
    background-size: cover; */
  }  
  button{ outline:none; border:none;}
  .bodySection{
    width: 100%; overflow-x: clip; position: relative; overflow: clip;
    &:after {
      content: ""; 
      position: absolute;
       top: 0; left: 0;
        // background: #1b032a;
        // background: #120D07;
         width: 400px;
          height: 400px;
           border-radius: 100%; 
           transform: scale(3) translate(-10%,-10%);
            filter: blur(60px); 
            z-index: -1;
          }
  } 
  .collapse-css-transition { transition: all 280ms cubic-bezier(0.4, 0, 0.2, 1); }
  .app__collapse{ visibility:hidden; opacity:0;}
  .app__collapse.collapse-active{ visibility:visible; opacity:1;}


  .Show-sm{ display:none !important; } 
  .youtube-embed {
    position: relative;
    padding-bottom: 56%;
    width: 100%;
    text-align: left;
  }

  .youtube-embed iframe {
    width: 100%;
    position: absolute;
    height: 100%;
    overflow: hidden;
  }


@media(max-width:767px){ 
  .Show-lg{ display:none !important; }
  .Show-sm{ display:flex !important; }
} 

`;



Gs.Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  padding: 0;
`;

export default Gs;


import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Logo from './../assets/images/logo.png' 
import { Container, SquareBtns } from '../theme/main.styled';


function Footer(props) {
    const Menu1 = [
        { name: 'Explore', label: 'Explore' },
        { name: 'All NFT', label: 'All NFT' },
        { name: 'Collectibles', label: 'Collectibles' },
        { name: 'Virtual Worlds', label: 'Virtual Worlds' }
    ]
    const Menu2 = [
        { name: 'Help Center', label: 'Help Center' },
        { name: 'billing', label: 'Partners' },
        { name: 'Blog', label: 'Blog' },
        { name: 'Docs', label: 'Docs' },
        { name: 'Newsletter', label: 'Newsletter' }
    ]
    
    const Menu3 = [
        { name: 'About Us', label: 'About Us' },
        { name: 'Careers', label: 'Careers' },
        { name: 'Support', label: 'Support' }
    ]
    
    return (
        <FooterMain>
            <Container >
                <FooterInner>
                    <FooterTxt>
                        <LogoM>
                            <img src={Logo} alt="logo" />
                        </LogoM> 
                        <p>The largest NFT marketplace. Authentic and truly 
                        unique digital creation. Signed and issued by the 
                        creator, made possible by blockchain technology.</p>
                        <SquareBtns>
                            <Link to="/"><i className="fab fa-facebook-f"></i></Link>
                            <Link to="/"><i className="fab fa-twitter"></i></Link>
                            <Link to="/"><i className="fab fa-linkedin-in"></i></Link>
                            <Link to="/"><i className="fab fa-youtube"></i></Link>
                        </SquareBtns>
                    </FooterTxt>
                    <ul>
                        <li>Marketplace</li>
                        {Menu1.map(({ label, name}) => (
                        <li key={name} >
                            <Link to="#">{label}</Link>
                        </li>
                        ))}
                    </ul>
                    <ul>
                        <li>Resources</li>
                        {Menu2.map(({ label, name}) => (
                        <li key={name} >
                            <Link to="#">{label}</Link>
                        </li>
                        ))}
                    </ul>
                    <ul>
                        <li>Company</li>
                        {Menu3.map(({ label, name}) => (
                        <li key={name} >
                            <Link to="#">{label}</Link>
                        </li>
                        ))}
                    </ul>
                </FooterInner>
            </Container>
        </FooterMain>
    )

}

const FooterMain = styled.footer`
    transition:all 500ms; min-height:90px; position:relative ; width:100%; padding: 200px 0 30px; overflow:hidden;
    &:after {content: ""; position: absolute; bottom: -30%; left: 0; background: #1a070a; width: 450px; height: 180px; border-radius: 100%; transform: scale(2) translate(0%, 0%); filter: blur(50px); z-index: -1;}
    @media(max-width: 768px){
        padding: 120px 0 30px; 
    }
    @media(max-width: 640px){
        &:after {bottom: 0; left: -20%; transform: scale(3) translate(0%, -25%) rotate(90deg); opacity: 0.8;}
    }
`; 
const FooterInner = styled.footer`
    display: flex; width:100%; 
    ul {
        padding: 18px 0 0 118px;
        li {
            font-size: 2.0rem; font-weight: 600; margin: 0 0 25px 0;
            a {
                font-size: 1.8rem; font-weight: normal; color: var(--text-color);
                &:hover {color: var(--primary)}
            }
        }
    }
    @media(max-width: 1024px){
        ul {
            padding: 18px 0 0 80px;
        }
    }
    @media(max-width: 768px){
        flex-flow: wrap;
        ul {width: 33.33%;  padding: 18px 40px 0 0;}
    }
    @media(max-width: 640px){
        ul {width: 100%;  padding: 22px 40px 0 0; border-top: 1px solid rgb(255,255,255,0.1);}
    }
`; 
const FooterTxt = styled.footer`
    width: 41.6666667%; margin-right: auto;
    p {font-size: 2.4rem; margin-bottom: 26px;}
    @media(max-width: 991px){
        p {font-size: 2.0rem;}
    }
    @media(max-width: 768px){
        width: 100%; margin-bottom: 30px;
    }
`
const LogoM = styled.div`
    width: 135px; margin: 0 0 30px 0;
`

export default Footer;

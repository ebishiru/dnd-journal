import { useNavigate, useLocation, Link } from "react-router-dom";

import styled from "styled-components";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const showButton = location.pathname !== "/";

    return (
        <HeaderContainer>
            {
                showButton && <BackButton onClick={() => navigate(-1)}>Go Back</BackButton>
            }
            {
                showButton && <Link to={"/"}><HomeButton>Home</HomeButton></Link>
            }
            <TitleText isHome={location.pathname === "/"}>D.N.D.</TitleText>
            <TitleText isHome={location.pathname === "/"}>DUNGEON NOTES DATABASE</TitleText>
        </HeaderContainer>
    )
}

export default Header;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    position: relative;
    padding: 1.5rem 0;
`

const TitleText = styled.p`
    font-size: ${(props) => (props.isHome ? "1.6rem" : "1.3rem")};
    font-weight: bold;
`


const BackButton = styled.button`
    position: absolute;
    top: 0;
    left: 0;
`

const HomeButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
`
import {Button, useTheme} from '@mui/material';
import {useNavigate} from 'react-router';

interface LogoProps {
    transparentBg?: boolean;
    width?: number;
    loginPage?: boolean;
}

function Logo({transparentBg, width, loginPage}: LogoProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const darkMode = theme.palette.mode === 'dark';
    let imagePath = '/static/images/logo/khenda_dark_logo.png';
    if (!darkMode) {
        imagePath = transparentBg
            ? '/static/images/logo/khenda_light_logo.png'
            : '/static/images/logo/khenda_dark_logo.png';
    }

    return (
        <>
            <Button
                onClick={() => navigate('/overview')}
                sx={{p: 0}}
                disabled={loginPage}
            >
                <img
                    src={imagePath}
                    width={width}
                    height="auto"
                    alt="Khenda"
                />
            </Button>
        </>
    );
}

export default Logo;

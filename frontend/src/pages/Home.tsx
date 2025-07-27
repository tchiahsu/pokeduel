import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h3>Landing Page</h3>
            <Link to='/multiplayer'>
                <button>Multiplayer</button>
            </Link>
        </div>
    );
}

import { Link } from 'react-router-dom';

export default function Multiplayer() {
    return (
        <div>
        <h3>Multiplayer Screen</h3>
        <Link to='/'>
            <button>Home</button>
        </Link>
        <Link to='/team-selection'>
            <button>Team Selection</button>
        </Link>
        </div>
    );
}

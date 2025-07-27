import { Link } from 'react-router-dom';

export default function Selection() {
    return (
        <div>
        <h3>Team Selection Screen</h3>
        <Link to='/multiplayer'>
            <button>Go to Multiplayer</button>
        </Link>
        <Link to='/battle'>
            <button>Battle Page</button>
        </Link>
        </div>
    );
}

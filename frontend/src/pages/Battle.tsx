import { Link } from 'react-router-dom';

export default function Battle() {
    return (
        <div>
        <h3>Battle Screen</h3>
        <Link to='/'>
            <button>Go Home</button>
        </Link>
        </div>
    );
}

import { Link } from 'react-router-dom';
import homeBg from '../assets/bg-forrest.jpg';
import Button from '../components/Button';

export default function Home() {



    return (
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
            
            <img
                src={homeBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
            />

            <div className="relative gap-5">
                <h1 className="text-8xl pb-6 tracking-[-8px] pokemon-h1">
                    PokeDuel
                </h1>
                <p className='m-3'>Battle Friends, Become a Champion</p>
                <div>
                    <Link to='/single-player' className='m-4'>
                        <Button>Solo Battle</Button>
                    </Link>
                    <Link to='/multiplayer' className='m-4'>
                        <Button>Multiplayer</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

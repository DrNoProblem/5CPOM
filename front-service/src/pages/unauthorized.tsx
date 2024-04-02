import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: FunctionComponent = () => {

    return (
        <div className="not-found flex-center flex-col w100">

            <h1 className='not-found__title'>Unauthorized page</h1>

            <Link to="/" className='not-found__button'>
                <div className="cta mlrauto">
                    <span>
                        Back to Home
                    </span>
                </div>
            </Link>
        </div>
    );
}

export default Unauthorized;
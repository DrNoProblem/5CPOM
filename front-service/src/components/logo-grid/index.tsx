import React, { FunctionComponent } from "react";
import './style.css';


type Props = {
    sizeblocs: number
    hover: boolean
};

const Logo: FunctionComponent<Props> = ({ sizeblocs, hover }) => {

    return (
        <div className="flex-center-align logo">
            {
                hover ? (

                    <div className="grid hover" style={{ gridAutoRows : sizeblocs + 'vh', gridAutoColumns : sizeblocs + 'vh', width : sizeblocs*15 + 'vh'}}>
                        <div className="grid-bloc__0" ></div >
                        <div className="grid-bloc__1"></div>
                        <div className="grid-bloc__2"></div>
                        <div className="grid-bloc__3"></div>

                        <div className="grid-bloc__4"></div>
                        <div className="grid-bloc__5"></div>
                        <div className="grid-bloc__6"></div>
                        <div className="grid-bloc__7"></div>
                        <div className="grid-bloc__8"></div>

                        <div className="grid-bloc__9"></div>
                        <div className="grid-bloc__10"></div>
                        <div className="grid-bloc__11"></div>
                        <div className="grid-bloc__12"></div>
                    </div >
                ) : (
                    <div className="grid" style={{ gridAutoRows : sizeblocs + 'vh', gridAutoColumns : sizeblocs + 'vh', width : sizeblocs*15 + 'vh'}}>
                        < div className="grid-bloc__0" ></div >
                        <div className="grid-bloc__1"></div>
                        <div className="grid-bloc__2"></div>
                        <div className="grid-bloc__3"></div>

                        <div className="grid-bloc__4"></div>
                        <div className="grid-bloc__5"></div>
                        <div className="grid-bloc__6"></div>
                        <div className="grid-bloc__7"></div>
                        <div className="grid-bloc__8"></div>

                        <div className="grid-bloc__9"></div>
                        <div className="grid-bloc__10"></div>
                        <div className="grid-bloc__11"></div>
                        <div className="grid-bloc__12"></div>
                    </div >
                )
            }
        </div >


    );
};
export default Logo;